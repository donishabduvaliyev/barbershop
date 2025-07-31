import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from 'react-i18next';


import clsx from 'clsx';

const Booking = () => {
  const location = useLocation();
  const { services, navigate } = useAppContext();
  const serviceId = location.state?.serviceId;
  const shop = services.find((s) => s.id === serviceId);

  // Early return if the service isn't found
  if (!shop) {
    return <div className="p-4 font-semibold text-red-600">Service not found</div>;
  }

  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");


  const workingDays = shop.workingHours?.days || [];

  // Generate the next 4 days for booking
  const dates = [...Array(4)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // --- REFACTORED TIME SLOT GENERATION ---
  const availableTimes = [];
  if (selectedDate) {
    const now = new Date();
    // Check if the selected date is today
    const isToday = selectedDate.toDateString() === now.toDateString();
    const [fromHour] = shop.workingHours.from.split(':').map(Number);
    const [toHour] = shop.workingHours.to.split(':').map(Number);

    for (let hour = fromHour; hour < toHour; hour++) {
      // ✨ FIX: For today, only show time slots that are in the future
      if (isToday && hour <= now.getHours()) {
        continue; // Skip past hours
      }
      availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSuccess(false);
  };

  const handleBooking = () => {
    if (!name || !phone || !selectedDate || !selectedTime) {
      setError(t("Please fill in all fields"));
      return;
    }

   setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };
  if (success) {
    return (
      <div className="p-6 text-center bg-green-50 rounded-lg">
        <h2 className="text-xl font-bold text-green-700 mb-2">{t('Booking Confirmed!')}</h2>
        <p className="text-gray-600">
          {t('Your appointment at')} <strong>{shop.name[lang]}</strong> {t('on')}{' '}
          <strong>{selectedDate.toLocaleDateString(lang)}</strong> {t('at')}{' '}
          <strong>{selectedTime}</strong> {t('is confirmed.')}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          {t('Back to Home')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto text-yellow-200">
      <h2 className="text-xl font-bold mb-4 ">{t('Book Your Visit')}</h2>
      <div className='flex flex-col items-center mb-6'>

        <span>
          <img src={shop.image} alt={shop.name[lang]} />
        </span>

        <h2>{
          shop.name[lang] ? t('Booking for') + ' ' + shop.name[lang] : t('Booking')}</h2>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">{t("Name")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder={t("Enter your name")}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">{t("Phone Number")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="+998901234567"
        />
      </div>



      <div>
        {/* --- Date Selection --- */}
        <div className="flex space-x-2 overflow-x-auto mb-4 pb-2">
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
                  'px-3 py-2 rounded-md border text-sm min-w-[100px] transition text-center',
                  {
                    'bg-purple-600 text-white border-purple-600':
                      selectedDate?.toDateString() === date.toDateString(),
                    'bg-white text-gray-700 border-gray-300 hover:border-purple-400':
                      selectedDate?.toDateString() !== date.toDateString(),
                    'opacity-50 cursor-not-allowed bg-gray-100': !isAvailable,
                  }
                )}
              >
                <div className="font-semibold">{translatedDayName}</div>
                {/* ✨ FIX: Use the app's language for date formatting */}
                <div className="text-xs">{date.toLocaleDateString(lang)}</div>
              </button>
            );
          })}
        </div>

        {/* --- Time Slot Selection --- */}
        {selectedDate && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={clsx(
                      'px-2 py-1.5 border rounded-md text-sm transition',
                      {
                        'bg-purple-600 text-white border-purple-600': selectedTime === time,
                        'bg-white text-gray-800 border-gray-300 hover:border-purple-400':
                          selectedTime !== time,
                      }
                    )}
                  >
                    {time}
                  </button>
                ))
              ) : (
                // ✨ UX: Show a message when no slots are available
                <p className="col-span-4 text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-md">
                  {t('No available time slots for this day.')}
                </p>
              )}
            </div>

            {/* --- Booking Confirmation Button --- */}
            <button
              onClick={handleBooking}
              disabled={!selectedTime || loading}
              className="w-full py-2.5 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('Booking...') : t('Confirm Booking')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
