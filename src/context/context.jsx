import React, { createContext, useState, useContext, use } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const catalog = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const { i18n } = useTranslation();
    const [booked, setBooked] = useState([]);
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const loggedInTelegramId = '123456789';
    const [confirmCancel, setConfirmCancel] = useState(null);
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


    const backEndUrl = " https://1a9de26c9bbc.ngrok-free.app"; // Adjust this URL to your backend server
    window.Telegram.WebApp.ready();
    const initData = window.Telegram.WebApp.initData;

    fetch(`${backEndUrl}/api/auth/validate-telegram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: initData })
    })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                // SUCCESS! The user is authenticated.
                console.log('Authenticated User:', data.user);
                // Now you can display their name, avatar, etc.
                document.body.innerHTML = `<h1>Welcome, ${data.user.name}!</h1>`;
            } else {
                // Handle error
                console.error(data.message);
                document.body.innerHTML = `<h1>Authentication Failed</h1>`;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });










    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then(setServices)
            .catch((err) => console.error("Failed to load services", err));
    }, []);

    //   console.log(services);

    useEffect(() => {
        fetch("/categories.json")
            .then((res) => res.json())
            .then(setCategories)
            .catch((err) => console.error("Failed to load categories", err));
    }, []);
    // console.log(categories);
    useEffect(() => {
        fetch("/booking.json")
            .then((res) => res.json())
            .then(setBookingHistory)
            .catch((err) => console.error("Failed to load categories", err));
    }, []);
    useEffect(() => {
        fetch("/user.json")
            .then((res) => res.json())
            .then(setUserInfo)
            .catch((err) => console.error("Failed to load categories", err));
    }, []);



    const addBooking = (newBooking) => {
        // Get the current list of bookings for this user, or an empty array if none exist
        const userBookings = bookingHistory[loggedInTelegramId] || [];

        // Update the state
        setBookingHistory({
            ...bookingHistory, // Keep all other users' bookings
            [loggedInTelegramId]: [...userBookings, newBooking] // Update the array for the current user
        });
    };



    const deleteBooking = (bookingId) => {
        // Get the current list of bookings for this user
        const userBookings = bookingHistory[loggedInTelegramId] || [];

        // Create the new list without the deleted booking
        const updatedUserBookings = userBookings.filter(b => b.id !== bookingId);
        setConfirmCancel(null); // Close the confirmation modal
        // Update the state
        setBookingHistory({
            ...bookingHistory, // Keep all other users' bookings
            [loggedInTelegramId]: updatedUserBookings // Set the updated array for the current user
        });
    };

    return (
        <AppContext.Provider value={{ catalog, booked, addBookedItem, removeBookedItem, navigate, i18n, services, categories, userInfo, bookingHistory, addBooking, deleteBooking, loggedInTelegramId, confirmCancel, setConfirmCancel }}>
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
