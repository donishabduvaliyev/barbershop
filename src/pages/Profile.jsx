import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../context/context';
import { UserInfoPage } from '../components/UserInfo';
import { BookingHistoryPage } from '../components/BookingHistory';

// --- ICONS (SF Symbols Style) ---
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const LanguageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13l4-4M19 5h-4M13 5a9 9 0 11-6 16m-2-8h4" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;



export const ProfilePage = ({ isOpen, onClose, telegramId, i18n, t }) => {
    const [activeSubPage, setActiveSubPage] = useState(null);
    const { userInfo, bookingHistory } = useAppContext();
    console.log('userInfo:', userInfo, 'bookingHistory:', bookingHistory);

    const user = useMemo(() => {
        if (!telegramId || !userInfo?.length) return null;
        return userInfo.find(u => u.telegramId === String(telegramId));
    }, [telegramId, userInfo]);

    const bookings = useMemo(() => bookingHistory[String(telegramId)] || [], [telegramId, bookingHistory]);

    console.log('Bookings for user:', bookings);




    if (!isOpen) return null;
    if (!user) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">Error: User not found.</div>;

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
                        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl my-4 shadow-sm">
                            <img src={user.avatar} alt="User Avatar" className="w-16 h-16 rounded-full" />
                            <div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
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


