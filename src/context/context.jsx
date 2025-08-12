import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const tg = window.Telegram.WebApp;
    tg.expand();
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
    const backEndUrl = "https://barbershop-backend-t7n7.onrender.com";

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ sortBy: 'rating' }); 
    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isSearching, setIsSearching] = useState(false);





    // useEffect to fetch data from front end 


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

    // useEffect for local development

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
        <AppContext.Provider value={{ catalog, booked, addBookedItem, removeBookedItem, navigate, i18n, services, categories, userInfo, bookingHistory, addBooking, deleteBooking, loggedInTelegramId, confirmCancel, setConfirmCancel, feedData, isLoading ,backEndUrl }}>
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