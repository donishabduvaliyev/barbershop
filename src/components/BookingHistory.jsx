import React, { useState } from 'react';
import { useAppContext } from '../context/context';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const BookingHistoryPage = ({ onBack, bookings, t }) => {
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [localBookings, setLocalBookings] = useState(bookings);
  const { backEndUrl, telegramInitData, navigate } = useAppContext();

  const handleRebook = (booking) => {
    const shopId = booking.shopId?._id || booking.shopId;
    if (shopId) navigate(`/booking/${shopId}`);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await fetch(`${backEndUrl}/api/user/bookings/${bookingToCancel._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: telegramInitData }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel the booking on the server.');
      }
      const updatedBookings = localBookings.map((b) =>
        b._id === bookingToCancel._id ? { ...b, status: 'cancelled' } : b
      );
      setLocalBookings(updatedBookings);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setBookingToCancel(null);
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent/15 text-accent border-accent/25';
      case 'completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      case 'cancelled':
        return 'bg-surface-3 text-text-faint border-border-soft';
      case 'rejected':
      case 'no-show':
        return 'bg-danger/15 text-danger border-danger/25';
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
    }
  };

  return (
    <div className="absolute inset-0 bg-bg z-30 animate-slide-in text-text overflow-y-auto">
      <header className="sticky top-0 p-2 bg-bg/80 backdrop-blur-xl flex items-center border-b border-border-soft">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-2 flex items-center text-accent">
          <ChevronLeftIcon /> <span className="font-semibold text-sm ml-1">{t('Profile', 'Profil')}</span>
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-24 space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">{t('BookingHistory', 'Buyurtmalar tarixi')}</h1>
          <p className="text-xs text-text-muted mt-0.5">{t('BookingHistoryDesc', 'Barcha avvalgi va faol qabullar ro\'yxati')}</p>
        </div>

        <div className="space-y-3">
          {localBookings.length > 0 ? (
            localBookings.map((booking) => {
              const reqDate = new Date(booking.requestedTime);
              const dateStr = reqDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const timeStr = reqDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={booking._id}
                  className="bg-surface rounded-2xl border border-border-soft p-4 shadow-sm space-y-3 hover:border-accent/30 transition-colors"
                >
                  {/* Shop & Status Header */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-text truncate">{booking.shopName}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize border shrink-0 ${statusBadgeClass(booking.status)}`}>
                      {t(booking.status, booking.status)}
                    </span>
                  </div>

                  {/* Labeled Information Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-surface-2/60 rounded-xl p-3 border border-border-soft/60">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block font-medium">
                        {t('Service', 'Xizmat')}:
                      </span>
                      <span className="font-semibold text-text truncate block mt-0.5">
                        {booking.serviceName || t('StandardService', 'Xizmat')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block font-medium">
                        {t('Barber', 'Sartarosh')}:
                      </span>
                      <span className="font-semibold text-text truncate block mt-0.5">
                        {booking.staffName || t('AnyBarber', 'Har qanday bo\'sh')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block font-medium">
                        {t('DateTime', 'Sana va vaqt')}:
                      </span>
                      <span className="font-semibold text-text block mt-0.5 tabular-nums">
                        {dateStr}, {timeStr}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block font-medium">
                        {t('Price', 'Narxi')}:
                      </span>
                      <span className="font-bold text-accent block mt-0.5">
                        {booking.price ? `${booking.price.toLocaleString()} UZS` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Rating / Actions footer */}
                  <div className="flex items-center justify-between pt-1">
                    {booking.rating ? (
                      <div className="flex items-center gap-1 text-xs text-warning font-semibold">
                        <span>⭐</span>
                        <span>{booking.rating} / 5</span>
                      </div>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                      {['pending', 'confirmed'].includes(booking.status) ? (
                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="px-3 py-1.5 text-xs font-medium rounded-xl bg-danger/15 text-danger hover:bg-danger/25 border border-danger/20 press-spring cursor-pointer"
                        >
                          {t('Cancel', 'Bekor qilish')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRebook(booking)}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-accent text-bg hover:bg-accent-hover press-spring shadow-sm cursor-pointer"
                        >
                          {t('Rebook', 'Qayta yozilish')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-surface rounded-2xl border border-border-soft p-8 text-center text-text-muted">
              <span className="text-3xl block mb-2">📭</span>
              <p className="italic">{t('NoBookings', 'Hozircha buyurtmalar mavjud emas')}</p>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xl text-center max-w-sm w-full text-text animate-slideUp">
            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-base">{t('Confirm Cancellation', 'Bekor qilishni tasdiqlang')}</h3>
            <p className="text-xs text-text-muted my-3">{t('SureCancelation', 'Ushbu bandlovni bekor qilmoqchimisiz?')}</p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-2.5 bg-surface-2 text-text font-medium rounded-xl border border-border-soft press-spring"
              >
                {t('no', 'Yo\'q')}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl press-spring shadow-sm shadow-danger/30"
              >
                {t('yesCancel', 'Ha, bekor qilinsin')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};