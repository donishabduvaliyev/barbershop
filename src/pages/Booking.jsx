import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

// Helper function to format numbers with leading zeros
const pad = (num) => num.toString().padStart(2, '0');

// Reusable component for the scrollable picker columns (Hour, Minute)
const ScrollPickerColumn = ({ items, selectedValue, onSelect, itemHeight = 40 }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const selectedIndex = items.indexOf(selectedValue);
      if (selectedIndex !== -1) {
        scrollRef.current.scrollTop = selectedIndex * itemHeight;
      }
    }
  }, [selectedValue, items, itemHeight]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const selectedIndex = Math.round(scrollTop / itemHeight);
      const newValue = items[selectedIndex];
      if (newValue !== undefined && newValue !== selectedValue) {
        onSelect(newValue);
      }
    }
  };

  const handleScrollEnd = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const selectedIndex = Math.round(scrollTop / itemHeight);
      scrollRef.current.scrollTo({ top: selectedIndex * itemHeight, behavior: 'smooth' });
    }
  };

  let scrollEndTimer = null;
  const onScroll = () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(handleScrollEnd, 150);
    handleScroll();
  };

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="w-full h-48 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
      }}
    >
      <div style={{ height: itemHeight * 2 }}></div>
      <div className="relative">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-center snap-center text-xl transition-all duration-300"
            style={{
              height: `${itemHeight}px`,
              opacity: selectedValue === item ? 1 : 0.4,
              transform: selectedValue === item ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ height: itemHeight * 2 }}></div>
    </div>
  );
};

const ValidationModal = ({ isOpen, onClose, message, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6 animate-popup">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">{message}</h3>
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          {t('OK')}
        </button>
      </div>
    </div>
  );
};

const Booking = () => {
  const location = useLocation();
  const { services, navigate, addBooking, } = useAppContext();
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [finalBookingTime, setFinalBookingTime] = useState(null);

  const serviceId = location.state?.serviceId;
  const shop = services.find((s) => s.id === serviceId);
  const lang = i18n.language || 'en';

  const dates = useMemo(() => [...Array(4)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  const { availableHours, availableMinutes } = useMemo(() => {
    if (!selectedDate || !shop) return { availableHours: [], availableMinutes: [] };
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const [fromHour] = shop.workingHours.from.split(':').map(Number);
    const [toHour] = shop.workingHours.to.split(':').map(Number);
    const startHour = isToday ? Math.max(fromHour, now.getHours() + 1) : fromHour;
    const hours = [];
    for (let hour = startHour; hour < toHour; hour++) {
      hours.push(pad(hour));
    }
    const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
    return { availableHours: hours, availableMinutes: minutes };
  }, [selectedDate, shop]);

  useEffect(() => {
    if (selectedDate) {
      if (availableHours.length > 0) {
        setSelectedHour(availableHours[0]);
        setSelectedMinute('00');
      } else {
        setSelectedHour(null);
        setSelectedMinute(null);
      }
    }
  }, [selectedDate, availableHours]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // --- FIXED: Booking logic is now entirely inside this function ---
  const handleBooking = () => {
    if (!name || !phone) {
      setValidationMessage(t("Please fill in your name and phone number"));
      setIsValidationModalOpen(true);
      return;
    }
    if (!selectedDate || selectedHour === null || selectedMinute === null) {
      setValidationMessage(t("Please select a valid date and time"));
      setIsValidationModalOpen(true);
      return;
    }

    setLoading(true);

    // 1. Create the final booking date object
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(parseInt(selectedHour, 10));
    bookingDate.setMinutes(parseInt(selectedMinute, 10));
    setFinalBookingTime(bookingDate); // Keep this for the success message UI

    // 2. Create the new booking object to be "saved"
    const newBooking = {
      id: Date.now(), // Unique ID
      serviceId: shop.id,
      serviceName: shop.name[lang], // Use the name in the current language
      date: bookingDate.toISOString(), // Store as a standardized string
      status: 'Upcoming',
      user: {
        name: name,
        phone: phone,
      },
    };
    // setNewBooking(newBooking)

    // 3. Call the addBooking function from your context
    addBooking(newBooking);
    console.log("New booking saved:", newBooking);

    // 4. Show success message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIsModalOpen(false);
    }, 1500);
  };

  if (!shop) {
    return <div className="p-4 font-semibold text-red-600">Service not found</div>;
  }

  if (success) {
    return (
      <div className="p-6 max-w-md mx-auto text-center bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg border border-green-200 dark:border-green-700">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">{t('Booking Confirmed!')}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {t('Your appointment at')} <strong>{shop.name[lang]}</strong> {t('on')}{' '}
          <strong>{finalBookingTime?.toLocaleDateString(lang)}</strong> {t('at')}{' '}
          <strong>{finalBookingTime?.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false })}</strong> {t('is confirmed.')}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          {t('Back to Home')}
        </button>
      </div>
    );
  }

  const workingDays = shop.workingHours?.days || [];

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="text-center mb-6">
        <img
          src={shop.image}
          alt={shop.name[lang]}
          className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/d1d5db/374151?text=Image+Not+Found'; }}
        />
        <h2 className="text-2xl font-bold">{t('Book Your Visit')}</h2>
        <p className="text-md text-gray-600 dark:text-gray-400">{shop.name[lang]}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t("Name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder={t("Enter your name")}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t("Phone Number")}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-purple-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          {t('Select Date and Time')}
        </button>
      </div>
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        message={validationMessage}
        t={t}
      />
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-end">
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-lg w-full max-w-sm flex flex-col overflow-hidden animate-slideUp">
            <div className="p-3 border-b border-gray-300/50 dark:border-zinc-700/50 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t('Choose a Time')}</h3>
              <button
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4 flex space-x-2 overflow-x-auto border-b border-gray-300/50 dark:border-zinc-700/50">
              {dates.map((date) => {
                const engDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const translatedDayName = t(`days.${engDayName}`, engDayName);
                const isAvailable = workingDays.includes(engDayName);
                return (
                  <button
                    key={date.toISOString()}
                    disabled={!isAvailable}
                    onClick={() => handleDateSelect(date)}
                    className={clsx(
                      'px-3 py-2 rounded-lg border text-sm min-w-[100px] transition-all text-center',
                      {
                        'bg-purple-600 text-white border-purple-600 font-semibold shadow-md': selectedDate?.toDateString() === date.toDateString(),
                        'bg-white/50 dark:bg-zinc-700/50 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-600 hover:border-purple-400 dark:hover:border-purple-500': selectedDate?.toDateString() !== date.toDateString(),
                        'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800': !isAvailable,
                      }
                    )}
                  >
                    <div className="font-semibold">{translatedDayName}</div>
                    <div className="text-xs">{date.toLocaleDateString(lang, { month: 'short', day: 'numeric' })}</div>
                  </button>
                );
              })}
            </div>
            {selectedDate && (
              <div className="flex flex-col p-4 gap-4">
                {availableHours.length > 0 ? (
                  <div className="relative flex justify-center items-center h-48">
                    <div className="absolute inset-x-4 h-10 bg-gray-300/40 dark:bg-zinc-700/40 rounded-lg top-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="flex w-full max-w-xs">
                      <ScrollPickerColumn items={availableHours} selectedValue={selectedHour} onSelect={setSelectedHour} />
                      <div className="flex items-center justify-center text-xl font-semibold text-gray-800 dark:text-gray-100">:</div>
                      <ScrollPickerColumn items={availableMinutes} selectedValue={selectedMinute} onSelect={setSelectedMinute} />
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-center text-gray-500 dark:text-gray-400">{t('No available time slots for this day.')}</p>
                  </div>
                )}
                <button
                  onClick={handleBooking}
                  disabled={selectedHour === null || loading}
                  className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('Booking...') : t('Confirm Booking')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
                @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes popup { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
                .animate-popup { animation: popup 0.2s ease-out forwards; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
    </div>
  );
};

export default Booking;
