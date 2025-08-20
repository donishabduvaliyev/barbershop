import React, { useState } from 'react';
import { useAppContext } from '../context/context';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

export const BookingHistoryPage = ({ onBack, bookings, t }) => {
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [localBookings, setLocalBookings] = useState(bookings);

    // FIX #1: Destructure from context as an object {}
    const { backEndUrl } = useAppContext();

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;

        try {
            // FIX #2: Add method: 'PATCH' and headers to the fetch call
            const response = await fetch(`${backEndUrl}/api/user/bookings/${bookingToCancel._id}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // FIX #3: Manually check for HTTP errors
            if (!response.ok) {
                // This will stop execution and jump to the catch block if the API fails
                throw new Error('Failed to cancel the booking on the server.');
            }

            // This part only runs if the API call was successful
            const updatedBookings = localBookings.map(b =>
                b._id === bookingToCancel._id ? { ...b, status: 'cancelled' } : b
            );
            setLocalBookings(updatedBookings);

        } catch (error) {
            console.error("Failed to cancel booking:", error);
            // Optionally show an error toast/modal to the user here
        } finally {
            setBookingToCancel(null); // Close the modal regardless of success or failure
        }
    };

    return (
        <div className="absolute inset-0 bg-gray-100 dark:bg-black z-30 animate-slide-in text-black dark:text-white">
            <header className="sticky top-0 p-2 bg-gray-100/80 dark:bg-black/80 backdrop-blur-xl flex items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-center text-purple-600 dark:text-purple-400">
                    <ChevronLeftIcon /> <span className="font-semibold">{t('Profile')}</span>
                </button>
            </header>
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">{t('BookingHistory')}</h1>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {localBookings.length > 0 ? localBookings.map(booking => (
                            <li key={booking._id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{booking.shopName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(booking.requestedTime).toLocaleString()}</p>
                                </div>
                                {['pending', 'confirmed'].includes(booking.status) ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/70 text-blue-300 capitalize">{t(booking.status)}</span>
                                        <button onClick={() => setBookingToCancel(booking)} className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200">Cancel</button>
                                    </div>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 capitalize">{t(booking.status)}</span>
                                )}
                            </li>
                        )) : <p className="p-4 text-center text-gray-500">{t('NoBookings')}</p>}
                    </ul>
                </div>
            </main>
            {bookingToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl text-center w-80">
                        <h3 className="font-bold text-lg">Confirm Cancellation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 my-4">Are you sure you want to cancel this booking?</p>
                        <div className="flex space-x-2">
                            <button onClick={() => setBookingToCancel(null)} className="flex-1 py-2 bg-gray-200 dark:bg-zinc-700 rounded-lg">No</button>
                            <button onClick={handleConfirmCancel} className="flex-1 py-2 bg-red-500 text-white rounded-lg">Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};