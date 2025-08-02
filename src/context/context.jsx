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
    // const [newBooking, setNewBooking] = useState(null);

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
