import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from 'react-i18next';

const Booking = () => {
  const location = useLocation();
  const { services, navigate } = useAppContext();
  const serviceId = location.state?.serviceId;
  const shop = services.find((s) => s.id === serviceId);
  if (!shop) {
    return <div className="p-4">Service not found</div>;
  }
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const workingDays = shop.workingHours?.days || [];
  const daysLocalized = t("days", { returnObjects: true });
  const today = new Date();
  const dates = [...Array(4)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });
  const availableTimes = [];
  if (selectedDate) {
    const [fromHour] = shop.workingHours.from.split(":").map(Number);
    const [toHour] = shop.workingHours.to.split(":").map(Number);
    for (let hour = fromHour; hour < toHour; hour++) {
      availableTimes.push(`${hour.toString().padStart(2, "0")}:00`);
    }
  }

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{t("Book Your Visit")}</h2>

      <div className="flex space-x-2 overflow-x-auto mb-4">
        {dates.map((date, idx) => {
          const engDayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const translatedDayName = daysLocalized[date.getDay()]; // 0 = Sunday
          const isAvailable = workingDays.includes(engDayName);

          return (
            <button
              key={idx}
              disabled={!isAvailable}
              onClick={() => setSelectedDate(date)}
              className={`px-3 py-2 rounded-md border text-sm min-w-[100px] transition
                ${selectedDate?.toDateString() === date.toDateString()
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"}
                ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div>{translatedDayName}</div>
              <div className="text-xs">{date.toLocaleDateString()}</div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-2 py-1 border rounded-md text-sm
                  ${selectedTime === time
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-800 border-gray-300"}`}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedTime || loading}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? t("Booking...") : t("Confirm Booking")}
          </button>

          {success && (
            <p className="text-green-500 text-sm mt-2">{t("Booking confirmed!")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Booking