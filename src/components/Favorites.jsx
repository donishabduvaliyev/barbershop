import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/context';
import FavoriteButton from './FavoriteButton';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

export const FavoritesPage = ({ onBack, telegramId, i18n, t }) => {
    const { backEndUrl, navigate, favoriteIds } = useAppContext();
    const [favorites, setFavorites] = useState(null);
    const lang = i18n.language || 'en';

    useEffect(() => {
        if (!telegramId) return;
        fetch(`${backEndUrl}/api/user/favorites/${telegramId}`)
            .then((res) => res.json())
            .then((data) => setFavorites(data.favorites || []))
            .catch((err) => {
                console.error('Failed to load favorites', err);
                setFavorites([]);
            });
    }, [telegramId, backEndUrl]);

    // Re-filter locally whenever a heart gets toggled elsewhere/here, so an
    // unfavorited shop disappears immediately without another round-trip.
    const visibleFavorites = (favorites || []).filter((shop) => favoriteIds.has(shop._id));

    return (
        <div className="absolute inset-0 bg-bg z-30 animate-slide-in text-text">
            <header className="sticky top-0 p-2 bg-bg/80 backdrop-blur-xl flex items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-2 flex items-center text-accent">
                    <ChevronLeftIcon /> <span className="font-semibold">{t('Profile')}</span>
                </button>
            </header>
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">{t('Favorites')}</h1>
                {favorites === null ? (
                    <p className="p-4 text-center text-text-muted">{t('Loading')}</p>
                ) : visibleFavorites.length > 0 ? (
                    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                        <ul className="divide-y divide-border-soft">
                            {visibleFavorites.map((shop) => (
                                <li
                                    key={shop._id}
                                    onClick={() => navigate(`/service/${shop._id}`)}
                                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-2 transition-colors"
                                >
                                    <img src={shop.image} alt={shop.name?.[lang] || shop.name?.en} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-text truncate">{shop.name?.[lang] || shop.name?.en}</p>
                                        <p className="text-xs text-text-muted">{shop.category}</p>
                                        <p className="text-xs text-warning">⭐ {shop.rating}</p>
                                    </div>
                                    <FavoriteButton shopId={shop._id} className="w-8 h-8 text-danger flex-shrink-0" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="p-4 text-center text-text-muted">{t('NoFavorites')}</p>
                )}
            </main>
        </div>
    );
};
