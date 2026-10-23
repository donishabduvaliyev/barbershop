import React, { useState } from 'react';
import { useAppContext } from '../context/context';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

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
            const updatedBookings = localBookings.map(b =>
                b._id === bookingToCancel._id ? { ...b, status: 'cancelled' } : b
            );
            setLocalBookings(updatedBookings);

        } catch (error) {
            console.error("Failed to cancel booking:", error);
        } finally {
            setBookingToCancel(null);
        }
    };

    return (
        <div className="absolute inset-0 bg-bg z-30 animate-slide-in text-text">
            <header className="sticky top-0 p-2 bg-bg/80 backdrop-blur-xl flex items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-2 flex items-center text-accent">
                    <ChevronLeftIcon /> <span className="font-semibold">{t('Profile')}</span>
                </button>
            </header>
            <main className="p-4">
                <h1 className="text-xl font-bold mb-4 tracking-tight">{t('BookingHistory')}</h1>
                <div className="bg-surface rounded-2xl border border-border-soft overflow-hidden shadow-sm">
                    <ul className="divide-y divide-border-soft">
                        {localBookings.length > 0 ? localBookings.map(booking => (
                            <li key={booking._id} className="p-4 flex justify-between items-center gap-2 hover:bg-surface-2/40 transition-colors">
                                <div className="min-w-0">
                                    <p className="font-semibold text-text truncate">{booking.shopName}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{new Date(booking.requestedTime).toLocaleString()}</p>
                                    {booking.rating && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-warning font-medium">
                                            <span>⭐</span>
                                            <span>{booking.rating} / 5</span>
                                        </div>
                                    )}
                                </div>
                                {['pending', 'confirmed'].includes(booking.status) ? (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border ${booking.status === 'confirmed' ? 'bg-accent/15 text-accent border-accent/25' : 'bg-warning/15 text-warning border-warning/25'}`}>
                                            {t(booking.status)}
                                        </span>
                                        <button onClick={() => setBookingToCancel(booking)} className="px-3 py-1 text-xs font-medium rounded-full bg-danger/15 text-danger hover:bg-danger/25 border border-danger/20 press-spring">{t('Cancel')}</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border ${booking.status === 'completed' ? 'bg-success/15 text-success border-success/25' : 'bg-surface-3 text-text-muted border-border-soft'}`}>
                                            {t(booking.status)}
                                        </span>
                                        <button onClick={() => handleRebook(booking)} className="px-3 py-1 text-xs font-medium rounded-full bg-accent text-bg hover:bg-accent-hover font-semibold press-spring shadow-sm shadow-accent/20">{t('Rebook')}</button>
                                    </div>
                                )}
                            </li>
                        )) : <p className="p-6 text-center text-text-muted italic">{t('NoBookings')}</p>}
                    </ul>
                </div>
            </main>
            {bookingToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xl text-center max-w-sm w-full text-text animate-slideUp">
                        <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-base">{t('Confirm Cancellation')}</h3>
                        <p className="text-xs text-text-muted my-3">{t('SureCancelation')}</p>
                        <div className="flex space-x-3 mt-4">
                            <button onClick={() => setBookingToCancel(null)} className="flex-1 py-2.5 bg-surface-2 text-text font-medium rounded-xl border border-border-soft press-spring">{t('no')}</button>
                            <button onClick={handleConfirmCancel} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl press-spring shadow-sm shadow-danger/30">{t('yesCancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};