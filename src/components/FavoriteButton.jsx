import React from 'react';
import { useAppContext } from '../context/context';
import { useTranslation } from 'react-i18next';

const HeartIcon = ({ filled }) => (
    <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6.716-4.35-9.428-8.06C.86 10.42 1.2 6.9 3.99 5.14c2.31-1.45 4.94-.73 6.31 1.02.4.5.7.99.7.99s.3-.49.7-.99c1.37-1.75 4-2.47 6.31-1.02 2.79 1.76 3.13 5.28 1.42 7.8C18.716 16.65 12 21 12 21z"
        />
    </svg>
);

// A small, self-contained heart toggle — drop it on any shop card, service
// page header, etc. It reads/writes favorites straight from AppContext so
// every instance stays in sync without prop-drilling favorite state around.
const FavoriteButton = ({ shopId, className = '' }) => {
    const { favoriteIds, toggleFavorite } = useAppContext();
    const { t } = useTranslation();
    const isFavorited = favoriteIds.has(shopId);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFavorite(shopId);
            }}
            aria-label={isFavorited ? t('RemoveFavorite') : t('AddFavorite')}
            className={`flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 ${isFavorited ? 'text-red-500' : 'text-white'
                } ${className}`}
        >
            <HeartIcon filled={isFavorited} />
        </button>
    );
};

export default FavoriteButton;
