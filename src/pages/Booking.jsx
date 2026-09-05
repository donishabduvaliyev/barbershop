import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppContext } from '../context/context';
import { BookingSkeleton } from '../components/Skeleton';

// --- Your helper components (pad, ScrollPickerColumn, ValidationModal) remain the same ---
const pad = (num) => num.toString().padStart(2, '0');

// Matches the backend's utils/dateKey.js — a 'YYYY-MM-DD' key in local time,
// used to check a staff member's scheduled days off against a whole day.
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Appointments are booked in fixed 1-hour slots (matches the backend, see
// utils/bookingTime.js) — one client occupies a barber for about an hour,
// so there's no need for finer-grained minute selection.
//
// Availability is staff-aware: a slot already taken by one barber must not
// hide that same hour for a different barber, or for a shop with no staff
// (single shared slot) vs a shop with several (full only once every staff
// member is booked that hour). A staff member's scheduled day off blocks
// every hour that day — enforced server-side too, this is just so the
// picker doesn't offer a slot the server would reject anyway.
const isHourTaken = (bookedSlots, date, hour, staffId, staffCount, capacity, isStaffOff) => {
  if (staffId && isStaffOff) return true;

  const target = new Date(date);
  target.setHours(hour, 0, 0, 0);
  const targetTime = target.getTime();
  const atHour = bookedSlots.filter((b) => new Date(b.requestedTime).getTime() === targetTime);

  if (staffId) {
    return atHour.some((b) => b.staffId === staffId);
  }
  if (!staffCount) {
    // No named staff — capacity is the shop's plain "how many chairs" number.
    return atHour.length >= (capacity || 1);
  }
  const distinctStaffBooked = new Set(atHour.filter((b) => b.staffId).map((b) => b.staffId)).size;
  return distinctStaffBooked >= staffCount;
};
const ScrollPickerColumn = ({ items, selectedValue, onSelect, itemHeight = 40 }) => { const scrollRef = useRef(null); useEffect(() => { if (scrollRef.current) { const selectedIndex = items.indexOf(selectedValue); if (selectedIndex !== -1) { scrollRef.current.scrollTop = selectedIndex * itemHeight; } } }, [selectedValue, items, itemHeight]); const handleScroll = () => { if (scrollRef.current) { const scrollTop = scrollRef.current.scrollTop; const selectedIndex = Math.round(scrollTop / itemHeight); const newValue = items[selectedIndex]; if (newValue !== undefined && newValue !== selectedValue) { onSelect(newValue); } } }; const handleScrollEnd = () => { if (scrollRef.current) { const scrollTop = scrollRef.current.scrollTop; const selectedIndex = Math.round(scrollTop / itemHeight); scrollRef.current.scrollTo({ top: selectedIndex * itemHeight, behavior: 'smooth' }); } }; let scrollEndTimer = null; const onScroll = () => { clearTimeout(scrollEndTimer); scrollEndTimer = setTimeout(handleScrollEnd, 150); handleScroll(); }; return (<div ref={scrollRef} onScroll={onScroll} className="w-full h-48 overflow-y-scroll snap-y snap-mandatory no-scrollbar" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)', }} > <div style={{ height: itemHeight * 2 }}></div> <div className="relative"> {items.map((item) => (<div key={item} className="flex items-center justify-center snap-center text-xl transition-all duration-300" style={{ height: `${itemHeight}px`, opacity: selectedValue === item ? 1 : 0.4, transform: selectedValue === item ? 'scale(1.1)' : 'scale(1)', }} > {item} </div>))} </div> <div style={{ height: itemHeight * 2 }}></div> </div>); };
// Rendered via a portal straight into document.body — as a sibling deep
// inside the page tree, this fixed z-[10000] overlay was still losing to
// the fixed bottom nav in paint order despite the higher z-index (the two
// fixed subtrees didn't compare the way plain z-index numbers suggest).
// Matches the same portal pattern already used by languageDropdown.jsx.
const ValidationModal = ({ isOpen, onClose, message, t }) => { if (!isOpen) return null; return createPortal(<div className="fixed inset-0 z-[10000] bg-black/60 flex justify-center items-center p-4"> <div className="bg-surface rounded-lg shadow-xl w-full max-w-sm text-center p-6 animate-popup"> <h3 className="text-lg font-semibold text-danger mb-4">{message}</h3> <button onClick={onClose} className="w-full bg-accent text-black px-4 py-2 rounded-md hover:bg-accent-hover transition" > {t('OK')} </button> </div> </div>, document.body); };

// === MAIN BOOKING COMPONENT (Refactored) ===
const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { backEndUrl, userInfo, showNotification, telegramInitData } = useAppContext();

  // --- State Management ---
  const [shop, setShop] = useState(null);
  const [availability, setAvailability] = useState({ workingHours: [], bookedSlots: [] });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Assuming you still want to collect this

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null); // null = "Any available"
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const serviceId = location.pathname.split('/').pop(); // Get ID from URL path

  // --- 1. Fetch Shop Details and Availability on Load ---
  useEffect(() => {
    if (!serviceId) return;

    const fetchShopData = async () => {
      try {
        const [shopRes, availabilityRes] = await Promise.all([
          fetch(`${backEndUrl}/api/shops/shops/${serviceId}`),
          fetch(`${backEndUrl}/api/shops/service/${serviceId}/availability`)
        ]);


        if (!shopRes.ok || !availabilityRes.ok) {
          throw new Error('Failed to fetch shop data.');
        }


        const shopData = await shopRes.json();
        const availabilityData = await availabilityRes.json();


        setShop(shopData);
        setAvailability(availabilityData);
        // Default to the shop's first service so bookings are never left
        // without a price/service reference — the picker below still lets
        // the customer change it.
        if (shopData.services?.length) {
          setSelectedServiceId(shopData.services[0]._id);
        }

      } catch (error) {
        console.error("Failed to load shop data", error);
        // Handle not found error, maybe navigate away
      }
    };
    fetchShopData();
  }, [serviceId]);

  // --- 2. Generate Dates and Available Times (Now using fetched data) ---
  const dates = useMemo(() => [...Array(4)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize date to start of day
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  const bookedSlots = useMemo(() => availability.bookedSlots || [], [availability.bookedSlots]);
  const staffCount = availability.staffCount || 0;
  const capacity = availability.capacity || 1;

  // Only staff who perform the selected service are offered as a pick —
  // an empty serviceIds list on a staff member means "does everything"
  // (the backward-compatible default for staff no one has restricted yet).
  const availableStaffForService = useMemo(() => {
    if (!shop?.staff) return [];
    if (!selectedServiceId) return shop.staff;
    return shop.staff.filter((m) => !m.serviceIds?.length || m.serviceIds.includes(selectedServiceId));
  }, [shop, selectedServiceId]);

  // If the customer picked a barber and then changes the service to
  // something that barber doesn't do, fall back to "Any available" instead
  // of silently leaving an now-invalid selection in place.
  useEffect(() => {
    if (selectedStaffId && !availableStaffForService.some((m) => m._id === selectedStaffId)) {
      setSelectedStaffId(null);
    }
  }, [availableStaffForService, selectedStaffId]);

  // A specific staff member's own hours (if they have any set) take
  // precedence over the shop's blanket hours — matches the backend's
  // resolution in routes/shops.js exactly.
  const effectiveWorkingHours = useMemo(() => {
    if (selectedStaffId) {
      const member = shop?.staff?.find((m) => m._id === selectedStaffId);
      if (member?.workingHours?.length) return member.workingHours;
    }
    return shop?.workingHours || [];
  }, [shop, selectedStaffId]);

  // Drives the "so-and-so is off that day" message below, separately from
  // the availableHours calculation so the render doesn't have to reach into it.
  const selectedStaffOffThatDay = useMemo(() => {
    if (!selectedDate || !selectedStaffId || !shop) return null;
    const member = shop.staff?.find((m) => m._id === selectedStaffId);
    return member?.daysOff?.includes(toDateKey(selectedDate)) ? member.name : null;
  }, [selectedDate, selectedStaffId, shop]);

  // Which hourly slots are free on the selected day, for the currently
  // selected barber (or shop-wide/"any available" capacity when none is
  // picked) — recomputes whenever the barber selection changes, since a
  // slot taken by one barber must not hide a different barber's open hour.
  const availableHours = useMemo(() => {
    if (!selectedDate || !effectiveWorkingHours || effectiveWorkingHours.length === 0) {
      return [];
    }

    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const schedule = effectiveWorkingHours.find(wh => wh.days.includes(dayName));
    if (!schedule) return [];

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    const [fromHour] = schedule.from.split(':').map(Number);
    const [toHour] = schedule.to.split(':').map(Number);

    const startHour = isToday ? Math.max(fromHour, now.getHours() + 1) : fromHour;

    const dateKey = toDateKey(selectedDate);
    const selectedMember = selectedStaffId ? shop.staff?.find((m) => m._id === selectedStaffId) : null;
    const isStaffOff = !!selectedMember?.daysOff?.includes(dateKey);
    // "Any available" capacity only counts staff actually working that day
    // and who perform the selected service — someone off, or who doesn't
    // do this, shouldn't hold open a slot nobody qualified can fill.
    const workingStaffCount = staffCount
      ? (shop.staff || []).filter((m) =>
          !m.daysOff?.includes(dateKey) && (!m.serviceIds?.length || !selectedServiceId || m.serviceIds.includes(selectedServiceId))
        ).length
      : staffCount;

    const hours = [];
    for (let h = startHour; h < toHour; h++) {
      if (!isHourTaken(bookedSlots, selectedDate, h, selectedStaffId, workingStaffCount, capacity, isStaffOff)) {
        hours.push(`${pad(h)}:00`);
      }
    }

    return hours;
  }, [selectedDate, shop, effectiveWorkingHours, bookedSlots, staffCount, capacity, selectedStaffId, selectedServiceId]);

  // Auto-select first available hour when date, barber, or availability changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedHour(availableHours.length > 0 ? availableHours[0] : null);
    }
  }, [selectedDate, availableHours]);


  // --- 3. Handle Booking Request Submission ---
  const handleRequestBooking = async () => {
    // Basic Validation
    if (!selectedDate || selectedHour === null) {
      setValidationMessage(t("Please select a valid date and time"));
      setIsValidationModalOpen(true);
      return;
    }
    if (!selectedServiceId) {
      setValidationMessage(t("PleaseSelectService"));
      setIsValidationModalOpen(true);
      return;
    }
    // Booking requires a verified Telegram identity — this app must be opened
    // from inside Telegram. The backend enforces this too; this is just a
    // clearer, immediate message instead of a generic network error.
    if (!telegramInitData) {
      setValidationMessage(t('TelegramOnlyBooking'));
      setIsValidationModalOpen(true);
      return;
    }
    setIsSubmitting(true);

    try {
      // Construct the final booking time — selectedHour is always on the hour
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(parseInt(selectedHour, 10), 0, 0, 0);

      // userTelegramId/username are derived server-side from the verified
      // initData below — the client can't be trusted to supply them.
      const requestBody = {
        initData: telegramInitData,
        shopId: shop._id,
        shopName: shop.name[lang],
        userNumber: phone,
        userTelegramNumber: userInfo?.phone || phone,
        userName: name,
        requestedTime: bookingDate.toISOString(),
        staffId: selectedStaffId || undefined,
        serviceId: selectedServiceId,
        lang,
      };

      const response = await fetch(`${backEndUrl}/api/shops/booking-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Manually check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error message from backend
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }

      // Success: close the picker and send the user home with a clear confirmation,
      // instead of leaving them on the picker unsure whether it went through.
      setIsModalOpen(false);
      showNotification(
        `${t('YouRequestFor')} ${shop.name[lang]} ${t('has been sent.')} ${t('ConfirmationSoon')}`
      );
      navigate('/');

    } catch (error) {
      console.error("Booking request failed:", error);
      setValidationMessage(error.message || "An error occurred. Please try again.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Rendering Logic ---
  if (!shop) return <BookingSkeleton />; // Initial loading state

  const workingDays = effectiveWorkingHours.flatMap(wh => wh.days);

  return (
    // Your existing JSX for the form and modal remains largely the same.
    // Just make sure the final "Confirm Booking" button calls handleRequestBooking
    // Example: <button onClick={handleRequestBooking} disabled={isSubmitting}> ... </button>
    <div className="p-4 pb-28 max-w-md mx-auto bg-bg text-text min-h-screen animate-pageIn">
      <div className="text-center mb-6"> <img src={shop.image} alt={shop.name[lang]} className="w-full h-48 object-cover rounded-lg shadow-md mb-4" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/d1d5db/374151?text=Image+Not+Found'; }} /> <h2 className="text-2xl font-bold">{t('Book Your Visit')}</h2> <p className="text-md text-text-muted">{shop.name[lang]}</p> </div> <div className="space-y-4"> <div> <label className="block mb-1 text-sm font-medium text-text-muted">{t("Name")}</label> <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-surface-2 border border-border rounded-md focus:ring-accent focus:border-accent" placeholder={t("Enter your name")} /> </div> <div> <label className="block mb-1 text-sm font-medium text-text-muted">{t("Phone Number")}</label> <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 bg-surface-2 border border-border rounded-md focus:ring-accent focus:border-accent" placeholder="+998 (33) 3333333" /> </div> </div> <div className="mt-8 text-center"> <button onClick={() => setIsModalOpen(true)} className="w-full bg-accent text-black text-lg px-6 py-3 rounded-lg shadow-md hover:bg-accent-hover transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/30" > {t('Select Date and Time')} </button> </div> <ValidationModal isOpen={isValidationModalOpen} onClose={() => setIsValidationModalOpen(false)} message={validationMessage} t={t} /> {isModalOpen && createPortal(<div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-end"> <div className="bg-surface/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-lg w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden animate-slideUp"> <div className="p-3 border-b border-border-soft flex justify-between items-center shrink-0"> <h3 className="font-semibold text-lg text-text">{t('Choose a Time')}</h3> <button className="text-text-muted hover:bg-surface-2 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold" onClick={() => setIsModalOpen(false)} > &times; </button> </div> <div className="overflow-y-auto"> {shop.services?.length > 0 && (<div className="p-4 border-b border-border-soft"> <p className="text-xs font-medium text-text-muted mb-2">{t('ChooseService')}</p> <div className="flex space-x-2 overflow-x-auto no-scrollbar"> {shop.services.map((service) => (<button key={service._id} onClick={() => setSelectedServiceId(service._id)} className={clsx('flex flex-col items-start min-w-[120px] px-3 py-2 rounded-xl border text-xs transition-all', selectedServiceId === service._id ? 'bg-accent text-black border-accent shadow-sm' : 'bg-surface-2/70 text-text-muted border-border')} > <span className="font-semibold truncate w-full text-left">{service.name?.[lang] || service.name?.en}</span> <span className="opacity-80">{service.price?.toLocaleString()} · {service.durationMinutes} {t('min', 'min')}</span> </button>))} </div> </div>)} {availableStaffForService.length > 0 && (<div className="p-4 border-b border-border-soft"> <p className="text-xs font-medium text-text-muted mb-2">{t('ChooseBarber')}</p> <div className="flex space-x-2 overflow-x-auto no-scrollbar"> <button onClick={() => setSelectedStaffId(null)} className={clsx('flex flex-col items-center min-w-[64px] px-2 py-1.5 rounded-xl border text-xs transition-all', selectedStaffId === null ? 'bg-accent text-black border-accent shadow-sm' : 'bg-surface-2/70 text-text-muted border-border')} > <span className="w-9 h-9 rounded-full bg-surface-3 flex items-center justify-center text-lg mb-1">✨</span> {t('AnyAvailable')} </button> {availableStaffForService.map((member) => (<button key={member._id} onClick={() => setSelectedStaffId(member._id)} className={clsx('flex flex-col items-center min-w-[64px] px-2 py-1.5 rounded-xl border text-xs transition-all', selectedStaffId === member._id ? 'bg-accent text-black border-accent shadow-sm' : 'bg-surface-2/70 text-text-muted border-border')} > <img src={member.photo || 'https://placehold.co/100x100/d1d5db/374151?text=%F0%9F%92%88'} alt={member.name} className="w-9 h-9 rounded-full object-cover mb-1" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/d1d5db/374151?text=%F0%9F%92%88'; }} /> <span className="truncate w-full text-center">{member.name}</span> </button>))} </div> </div>)} <div className="p-4 flex space-x-2 overflow-x-auto border-b border-border-soft"> {dates.map((date) => { const engDayName = date.toLocaleDateString('en-US', { weekday: 'long' }); const translatedDayName = t(`days.${engDayName}`, engDayName); const isAvailable = workingDays.includes(engDayName); return (<button key={date.toISOString()} disabled={!isAvailable} onClick={() => setSelectedDate(date)} className={clsx('px-3 py-2 rounded-lg border text-sm min-w-[100px] transition-all text-center', { 'bg-accent text-black border-accent font-semibold shadow-md': selectedDate?.toDateString() === date.toDateString(), 'bg-surface-2/70 text-text-muted border-border hover:border-accent/60': selectedDate?.toDateString() !== date.toDateString(), 'opacity-50 cursor-not-allowed bg-surface-3': !isAvailable, })} > <div className="font-semibold">{translatedDayName}</div> <div className="text-xs">{date.toLocaleDateString(lang, { month: 'short', day: 'numeric' })}</div> </button>); })} </div> {selectedDate && (<div className="flex flex-col p-4 gap-4"> {availableHours.length > 0 ? (<div className="relative flex justify-center items-center h-48"> <div className="absolute inset-x-4 h-10 bg-surface-3/70 rounded-lg top-1/2 -translate-y-1/2 pointer-events-none"></div> <div className="flex w-full max-w-[140px]"> <ScrollPickerColumn items={availableHours} selectedValue={selectedHour} onSelect={setSelectedHour} /> </div> </div>) : (<div className="h-48 flex items-center justify-center px-4"> <p className="text-center text-text-muted">{selectedStaffOffThatDay ? t('StaffOffThatDay', { name: selectedStaffOffThatDay }) : t('No available time slots for this day.')}</p> </div>)} <button onClick={handleRequestBooking} disabled={selectedHour === null || !selectedServiceId || isSubmitting} className="w-full py-3 px-4 bg-accent text-black font-semibold rounded-md hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed" > {isSubmitting ? t('Sending Request...') : t('Request Booking')} </button> </div>)} </div> </div> </div>, document.body)}
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes popup { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } .animate-slideUp { animation: slideUp 0.3s ease-out forwards; } .animate-popup { animation: popup 0.2s ease-out forwards; } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default Booking;