import React, { useState, useEffect } from 'react';
import { UserInfoPage } from '../components/UserInfo';
import { BookingHistoryPage } from '../components/BookingHistory';
import { useAppContext } from '../context/context'; // Keep for other context values if needed

// --- Your Icon components remain the same ---
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


export const ProfilePage = ({ isOpen, onClose, telegramId, i18n, t }) => {
    // --- NEW: State for the fetched profile data, loading, and errors ---
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSubPage, setActiveSubPage] = useState(null);
    const {backEndUrl} = useAppContext

    // --- NEW: useEffect hook to fetch data when the component opens ---
    useEffect(() => {
        // Don't fetch if the modal isn't open or if there's no ID
        // if (!isOpen || !telegramId) return;

        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`${backEndUrl}/api/user/profile/${telegramId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data.');
                }
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [isOpen, telegramId]); // Re-fetch if the modal is opened with a new user ID

    if (!isOpen) return null;

    // --- NEW: Handle loading and error states ---
    if (isLoading) {
        return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">Loading Profile...</div>;
    }
    if (error || !profileData) {
        return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">Error: Could not load profile.</div>;
    }

    // --- CHANGED: Get user and bookings directly from the fetched profile data ---
    const { user } = profileData;
    const bookings = Array.isArray(profileData?.bookings) ? profileData.bookings : [];

    const renderSubPage = () => {
        switch (activeSubPage) {
            case 'userInfo': return <UserInfoPage onBack={() => setActiveSubPage(null)} user={user} t={t} />;
            case 'bookingHistory': return <BookingHistoryPage onBack={() => setActiveSubPage(null)} bookings={bookings} t={t} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
            <div className="absolute inset-0 bg-gray-100 dark:bg-black animate-slide-up overflow-hidden">
                <div className="h-full overflow-y-auto no-scrollbar">
                    <header className="sticky top-0 z-20 p-2 bg-gray-100/80 dark:bg-black/80 backdrop-blur-xl flex items-center justify-between">
                        <h1 className="font-bold text-lg">{t('Profile')}</h1>
                        <div className="w-16 flex justify-end">
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"><XIcon /></button>
                        </div>
                    </header>

                    <main className="max-w-4xl mx-auto px-4 pb-28">
                        {/* --- CHANGED: Now uses the 'user' object from our state --- */}
                        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl my-4 shadow-sm">
                            <img src={user.avatar} alt="User Avatar" className="w-16 h-16 rounded-full" />
                            <div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone || 'No phone number'}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden">
                            <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                                <li><button onClick={() => setActiveSubPage('userInfo')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"><div className="flex items-center space-x-3"><UserCircleIcon /><span>{t('MyDetails')}</span></div><ChevronRightIcon /></button></li>
                                <li><button onClick={() => setActiveSubPage('bookingHistory')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"><div className="flex items-center space-x-3"><ClockIcon /><span>{t('BookingHistory')}</span></div><ChevronRightIcon /></button></li>
                            </ul>
                        </div>

                        <div className="mt-6">
                            <button className="w-full flex justify-center items-center space-x-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm text-red-500 dark:text-red-500 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                <LogoutIcon />
                                <span>{t('LogOut')}</span>
                            </button>
                        </div>
                    </main>
                </div>
                {renderSubPage()}
            </div>
        </div>
    );
}