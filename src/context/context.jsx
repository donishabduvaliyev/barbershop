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

   
 const [services, setServices] = useState([]);
 const [categories, setCategories] = useState([]);


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



    return (
        <AppContext.Provider value={{ catalog, booked, addBookedItem, removeBookedItem,navigate, i18n  , services , categories}}>
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
