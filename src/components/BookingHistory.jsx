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
                <h1 className="text-2xl font-bold mb-4">{t('BookingHistory')}</h1>
                <div className="bg-surface rounded-2xl shadow-sm">
                    <ul className="divide-y divide-border-soft">
                        {localBookings.length > 0 ? localBookings.map(booking => (
                            <li key={booking._id} className="p-4 flex justify-between items-center gap-2">
                                <div className="min-w-0">
                                    <p className="font-semibold text-text truncate">{booking.shopName}</p>
                                    <p className="text-sm text-text-muted">{new Date(booking.requestedTime).toLocaleString()}</p>
                                    {booking.rating && (
                                        <p className="text-xs text-warning mt-0.5">{t('YourRating')}: {'⭐'.repeat(booking.rating)}</p>
                                    )}
                                </div>
                                {['pending', 'confirmed'].includes(booking.status) ? (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/15 text-accent capitalize">{t(booking.status)}</span>
                                        <button onClick={() => setBookingToCancel(booking)} className="px-3 py-1 text-xs font-medium rounded-full bg-danger/15 text-danger hover:bg-danger/25">{t('Cancel')}</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <span className={`px-2 py-1 text-xs font-medium ${booking.status === 'completed' ? 'bg-success/20 text-success' : 'bg-surface-3 text-text-muted'}  rounded-full  capitalize`}>{t(booking.status)}</span>
                                        <button onClick={() => handleRebook(booking)} className="px-3 py-1 text-xs font-medium rounded-full bg-accent/15 text-accent hover:bg-accent/25">{t('Rebook')}</button>
                                    </div>
                                )}
                            </li>
                        )) : <p className="p-4 text-center text-text-muted">{t('NoBookings')}</p>}
                    </ul>
                </div>
            </main>
            {bookingToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-surface p-6 rounded-2xl shadow-xl text-center w-80 text-text">
                        <h3 className="font-bold text-lg">{t('Confirm Cancellation')}</h3>
                        <p className="text-sm text-text-muted my-4">{t('SureCancelation')}</p>
                        <div className="flex space-x-2">
                            <button onClick={() => setBookingToCancel(null)} className="flex-1 py-2 bg-surface-2 rounded-lg">{t('no')}</button>
                            <button onClick={handleConfirmCancel} className="flex-1 py-2 bg-danger text-white rounded-lg">{t('yesCancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};