import React, { useState, useEffect } from 'react';
import { UserInfoPage } from '../components/UserInfo';
import { BookingHistoryPage } from '../components/BookingHistory';
import { FavoritesPage } from '../components/Favorites';
import { useAppContext } from '../context/context';
import { ProfileSkeleton } from '../components/Skeleton';

const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" /></svg>;


export const ProfilePage = ({ isOpen, onClose, telegramId, i18n, t }) => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSubPage, setActiveSubPage] = useState(null);
    const {backEndUrl, telegramInitData} = useAppContext()

    useEffect(() => {
        if (!isOpen) return;
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`${backEndUrl}/api/user/profile/${telegramId}`, {
                    headers: { 'x-telegram-init-data': telegramInitData },
                });
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
    }, [isOpen, telegramId]); 

    if (!isOpen) return null;

    const user = profileData?.user;
    const bookings = Array.isArray(profileData?.bookings) ? profileData.bookings : [];

    const renderSubPage = () => {
        switch (activeSubPage) {
            case 'userInfo': return <UserInfoPage onBack={() => setActiveSubPage(null)} user={user} bookings={bookings} t={t} />;
            case 'bookingHistory': return <BookingHistoryPage onBack={() => setActiveSubPage(null)} bookings={bookings} t={t} />;
            case 'favorites': return <FavoritesPage onBack={() => setActiveSubPage(null)} telegramId={telegramId} i18n={i18n} t={t} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
            <div className="absolute inset-0 bg-bg animate-slide-up overflow-hidden">
                <div className="h-full overflow-y-auto no-scrollbar">
                    <header className="sticky top-0 z-20 p-2 bg-bg/80 backdrop-blur-xl flex items-center justify-between">
                        <h1 className="font-bold text-lg text-accent">{t('Profile')}</h1>
                        <div className="w-16 flex justify-end">
                            <button onClick={onClose} className="p-2 rounded-full text-text-muted bg-surface-2 hover:bg-surface-3"><XIcon /></button>
                        </div>
                    </header>

                    {isLoading ? (
                        <ProfileSkeleton />
                    ) : (error || !user) ? (
                        <div className="flex items-center justify-center py-24 text-text-muted">{t('ProfileError')}</div>
                    ) : (
                        <main className="max-w-4xl mx-auto px-4 pb-28 animate-pageIn">
                            <div className="flex items-center space-x-4 p-4 text-text bg-surface border border-border-soft rounded-2xl my-4 shadow-sm">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=D4AF5A&color=0A0A0C`}
                                    alt="User Avatar"
                                    className="w-16 h-16 rounded-full object-cover shrink-0"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=D4AF5A&color=0A0A0C`;
                                    }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-lg text-text truncate">{user.name}</p>
                                    <p className="text-sm text-text-muted font-mono">{user.phone || t('NoPhone', 'Telefon raqam kiritilmagan')}</p>
                                    {user.username && <p className="text-xs text-accent mt-0.5">@{user.username}</p>}
                                </div>
                            </div>

                            {/* Refined Quick Summary KPIs */}
                            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
                                <div className="bg-surface border border-border-soft rounded-xl p-3 shadow-sm">
                                    <span className="text-[11px] text-text-muted block font-medium">{t('TotalVisits', 'Jami tashrif')}</span>
                                    <span className="text-lg font-bold text-text tabular-nums">{bookings.length}</span>
                                </div>
                                <div className="bg-surface border border-border-soft rounded-xl p-3 shadow-sm">
                                    <span className="text-[11px] text-text-muted block font-medium">{t('Completed', 'Bajarilgan')}</span>
                                    <span className="text-lg font-bold text-emerald-400 tabular-nums">
                                        {bookings.filter(b => b.status === 'completed').length}
                                    </span>
                                </div>
                                <div className="bg-surface border border-border-soft rounded-xl p-3 shadow-sm">
                                    <span className="text-[11px] text-text-muted block font-medium">{t('Favorites', 'Sevimlilar')}</span>
                                    <span className="text-lg font-bold text-accent tabular-nums">{user.favorites?.length || 0}</span>
                                </div>
                            </div>

                            <div className="bg-surface text-text rounded-2xl shadow-sm overflow-hidden border border-border-soft">
                                <ul className="divide-y divide-border-soft">
                                    <li><button onClick={() => setActiveSubPage('userInfo')} className="w-full flex justify-between items-center p-4 hover:bg-surface-2 transition-colors"><div className="flex items-center space-x-3"><UserCircleIcon /><span>{t('MyDetails')}</span></div><ChevronRightIcon /></button></li>
                                    <li><button onClick={() => setActiveSubPage('bookingHistory')} className="w-full flex justify-between items-center p-4 hover:bg-surface-2 transition-colors"><div className="flex items-center space-x-3"><ClockIcon /><span>{t('BookingHistory')}</span></div><ChevronRightIcon /></button></li>
                                    <li><button onClick={() => setActiveSubPage('favorites')} className="w-full flex justify-between items-center p-4 hover:bg-surface-2 transition-colors"><div className="flex items-center space-x-3"><HeartIcon /><span>{t('Favorites')}</span></div><ChevronRightIcon /></button></li>
                                </ul>
                            </div>

                            <div className="mt-6">
                                <button className="w-full flex justify-center items-center space-x-3 p-4 bg-surface rounded-2xl shadow-sm text-danger font-semibold hover:bg-surface-2 transition-colors">
                                    <LogoutIcon />
                                    <span>{t('LogOut')}</span>
                                </button>
                            </div>
                        </main>
                    )}
                </div>
                {renderSubPage()}
            </div>
        </div>
    );
}