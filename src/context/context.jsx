import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const catalog = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const { i18n } = useTranslation();
    const [booked, setBooked] = useState([]);
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState([]);
    const [tgUser, setTgUser] = useState(null);
    // --- CHANGE 1: Initialize userInfo as null ---
    // This helps us know if the user is still loading, authenticated, or failed.
    const [userInfo, setUserInfo] = useState(null);
    const [feedData, setFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [confirmCancel, setConfirmCancel] = useState(null);
    const backEndUrl = "https://barbershop-backend-t7n7.onrender.com";

    // console.log("initData from Telegram:", initData);
    // --- CHANGE 2: Wrap all authentication logic in a useEffect hook ---
    // useEffect(() => {    // This effect runs only ONCE when the component first mounts.
    //     // Let Telegram know the web app is ready.



    //     if (!tg.initData) {
    //         console.error("Authentication failed: initData is missing.");
    //         // You could show an error page here
    //         return;
    //     }

    //     fetch(`${backEndUrl}/api/auth/validate-telegram`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ initData: initData })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.user) {
    //                 console.log('Authenticated User:', data.user);
    //                 // --- CHANGE 3: Store the user data in state ---
    //                 // This is the correct way to handle the response in React.
    //                 setUserInfo(data.user);
    //             } else {
    //                 console.error("Authentication failed:", data.message);
    //                 setUserInfo(null);
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Fetch error during validation:', error);
    //             setUserInfo(null);
    //         });

    // }, []); // The empty array [] is crucial. It tells React to run this effect only once.
    console.log("Initializing Telegram Web App...", feedData);

    const tg = window.Telegram.WebApp;
    tg.expand();


    useEffect(() => {


        function feedData() {

            fetch(`${backEndUrl}/api/shops/home-feed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
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

        console.log(tg.initDataUnsafe?.user?.id);


        const telegramIdfromTelegram = tg.initDataUnsafe?.user?.id;

        if (telegramIdfromTelegram) {
            fetch(`${backEndUrl}/api/shops/get-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: telegramIdfromTelegram })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("User from DB:", data.user);
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

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then(setServices)
            .catch((err) => console.error("Failed to load services", err));
    }, []);

    useEffect(() => {
        fetch("/categories.json")
            .then((res) => res.json())
            .then(setCategories)
            .catch((err) => console.error("Failed to load categories", err));
    }, []);

    useEffect(() => {
        fetch("/booking.json")
            .then((res) => res.json())
            .then(setBookingHistory)
            .catch((err) => console.error("Failed to load booking history", err));
    }, []);

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
        <AppContext.Provider value={{ catalog, booked, addBookedItem, removeBookedItem, navigate, i18n, services, categories, userInfo, bookingHistory, addBooking, deleteBooking, loggedInTelegramId, confirmCancel, setConfirmCancel , feedData }}>
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