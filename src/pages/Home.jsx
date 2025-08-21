import React, { useMemo, useState } from 'react'
import SearchBar from '../components/searchbar';
import ServiceCarousel from '../components/Carusel';
import ServiceCatalog from '../components/Catalog';
import { useAppContext } from '../context/context.jsx';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../components/languageDropdown.jsx';
import { ProfilePage } from './Profile.jsx';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" className="w-9 h-9  border border-yellow-300 rounded-full p-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);


const Home = () => {
    const { catalog, booked, setBooked, userInfo, loggedInTelegramId } = useAppContext();

    const { t, i18n } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const user = useMemo(() => {
        if (!loggedInTelegramId || !userInfo?.length) return null;
        return userInfo.find(u => u.telegramId === String(loggedInTelegramId));
    }, [loggedInTelegramId, userInfo]);
    const userName = user ? user.name : 'Guest';

    return (
        <div className='bg-[#FFFFFF]  text-[rgba(60,60,67,0.6)] dark:bg-black dark:text-white flex flex-col overflow-hidden'>
            <div className="px-4 pt-6 flex justify-between items-center">
                <div className='flex gap-3  justify-between '>
                    <span onClick={() => setIsProfileOpen(true)}>
                        <UserIcon />

                    </span>

                    <div className='flex flex-col'>
                        <h1 className="text-[12px] text-red-200"> {t('welcome_message')} {userName}</h1>
                        <h1 className="text-[12px] font-semibold">{t("greeting")}</h1>
                    </div>
                </div>
                <div>
                    <div>
                        {booked}
                    </div>
                    <div>
                        <LanguageToggleButton />
                    </div>
                </div>

            </div>

            <div>
                <SearchBar />
            </div>
            <div>
                <ServiceCarousel
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>
            <div>
                <ServiceCatalog
                    selectedCategory={selectedCategory}
                />
            </div>




            <ProfilePage
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                telegramId={loggedInTelegramId}
                i18n={i18n}
                t={t}
            />
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-slide-in { animation: slide-in 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>

        </div>
    )
}

export default Home