import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const tg = window.Telegram?.WebApp;
    tg?.expand();
    const catalog = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const { i18n } = useTranslation();
    const [booked, setBooked] = useState([]);
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState([]);
    const [tgUser, setTgUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [feedData, setFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [notification, setNotification] = useState(null);
    const backEndUrl = import.meta.env.VITE_BACKEND_URL || '';
    // Raw, HMAC-signed initData string. Only Telegram can produce a valid one —
    // it's empty outside Telegram (e.g. a plain browser), which the backend
    // rejects on write actions like booking. Never trust tg.initDataUnsafe for
    // auth: it's a client-readable convenience object, not a verified value.
    const telegramInitData = tg?.initData || '';

    const showNotification = (message, type = 'success') => {
        setNotification({ id: Date.now(), message, type });
    };
    const clearNotification = () => setNotification(null);

    // Favorites live on the user document (userInfo.favorites) so they persist
    // across devices/sessions — this just mirrors that array as a Set for O(1)
    // "is this shop favorited" lookups from card components.
    const favoriteIds = new Set((userInfo?.favorites || []).map((id) => id.toString()));

    const toggleFavorite = async (shopId) => {
        if (!telegramInitData) {
            showNotification(i18n.t('TelegramOnlyBooking'), 'error');
            return;
        }
        if (!userInfo) {
            showNotification(i18n.t('FavoriteRequiresAccount'), 'error');
            return;
        }

        const wasFavorited = favoriteIds.has(shopId);
        const previousFavorites = userInfo.favorites || [];
        const optimisticFavorites = wasFavorited
            ? previousFavorites.filter((id) => id.toString() !== shopId)
            : [...previousFavorites, shopId];
        setUserInfo((prev) => (prev ? { ...prev, favorites: optimisticFavorites } : prev));

        try {
            const res = await fetch(`${backEndUrl}/api/user/favorites/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: telegramInitData, shopId }),
            });
            if (!res.ok) throw new Error('Failed to update favorites');
            const data = await res.json();
            setUserInfo((prev) => (prev ? { ...prev, favorites: data.favorites } : prev));
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            setUserInfo((prev) => (prev ? { ...prev, favorites: previousFavorites } : prev));
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ sortBy: 'rating' }); 
    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isSearching, setIsSearching] = useState(false);





    // useEffect to fetch data from front end 

useEffect(() => {
        function getShops() {

            fetch(`${backEndUrl}/api/shops/allShops`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {

                    setServices(data);
                    console.log("Shop data fetched successfully:", data);
                })
                .catch(error => {
                    setError('Failed to load the feed. Please try again later.');
                    console.error("Error fetching feed data:", error);
                })
               
        }
        getShops();
    }, []);



    useEffect(() => {

// fix function to fetch data from backend and set it to feedData state
        function feedData() {

            fetch(`${backEndUrl}/api/shops/home-feed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setIsLoading(true)
                    setFeedData(data);
                    console.log("Feed data fetched successfully:", data);
                })
                .catch(error => {
                    setError('Failed to load the feed. Please try again later.');
                    console.error("Error fetching feed data:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }



        feedData();




        // Call the function
    }, []);
    useEffect(() => {

        console.log(tg?.initDataUnsafe?.user?.id);


        const telegramIdfromTelegram = tg?.initDataUnsafe?.user?.id;

        if (telegramIdfromTelegram) {
            fetch(`${backEndUrl}/api/user/get-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: telegramIdfromTelegram })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("User from DB:", data.user);
                    setUserInfo(data.user);
                    // Now you can display the user info in the UI
                })
                .catch(err => console.error("Error fetching user:", err));
        } else {
            console.error("No Telegram ID found");
        }



    }, [])


    const loggedInTelegramId = userInfo ? userInfo.telegramId : 123456789;

    const addBookedItem = (item) => {
        if (!booked.includes(item)) {
            setBooked((prevBooked) => [...prevBooked, item]);
        } else {
            console.warn(`Item ${item} is already booked.`);
        }
    };

    const removeBookedItem = (itemToRemove) => {
        setBooked((prevBooked) => prevBooked.filter((item) => item !== itemToRemove));
    };

    // Fire-and-forget visit tracking for the super-admin dashboard — never
    // awaited, never blocks the UI, and a failure here is silently ignored
    // since it must never affect the customer experience. See
    // routes/track.js and models/pageView.js in the backend.
    useEffect(() => {
        fetch(`${backEndUrl}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'app_open', userTelegramId: tg?.initDataUnsafe?.user?.id || null }),
        }).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Lands the customer straight on a specific shop's page when the app is
    // opened via a per-shop QR code — those encode a Telegram Mini App
    // direct link (t.me/<bot>/<shortname>?startapp=shop_<id>, generated in
    // the super-admin panel), and Telegram delivers that payload here via
    // start_param rather than appending it to the loaded URL. Normal app
    // opens (no start_param) are a no-op.
    useEffect(() => {
        const startParam = tg?.initDataUnsafe?.start_param;
        const match = startParam?.match(/^shop_([a-f0-9]{24})$/);
        if (match) navigate(`/service/${match[1]}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect for local development

    useEffect(() => {
        fetch("/categories.json")
            .then((res) => res.json())
            .then(setCategories)
            .catch((err) => console.error("Failed to load categories", err));
    }, []);

    // useEffect(() => {
    //     fetch("/booking.json")
    //         .then((res) => res.json())
    //         .then(setBookingHistory)
    //         .catch((err) => console.error("Failed to load booking history", err));
    // }, []);

    const addBooking = (newBooking) => {
        if (!loggedInTelegramId) return;
        const userBookings = bookingHistory[loggedInTelegramId] || [];
        setBookingHistory({
            ...bookingHistory,
            [loggedInTelegramId]: [...userBookings, newBooking]
        });
    };

    const deleteBooking = (bookingId) => {
        if (!loggedInTelegramId) return;
        const userBookings = bookingHistory[loggedInTelegramId] || [];
        const updatedUserBookings = userBookings.filter(b => b.id !== bookingId);
        setConfirmCancel(null);
        setBookingHistory({
            ...bookingHistory,
            [loggedInTelegramId]: updatedUserBookings
        });
    };

    return (
        <AppContext.Provider value={{ catalog, booked, addBookedItem, removeBookedItem, navigate, i18n, services, categories, userInfo, bookingHistory, addBooking, deleteBooking, loggedInTelegramId, confirmCancel, setConfirmCancel, feedData, isLoading ,backEndUrl, notification, showNotification, clearNotification, telegramInitData, favoriteIds, toggleFavorite   }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};