// src/components/LanguageDrawer.jsx
import { TranslateIcon } from '@heroicons/react/outline';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageDrawer() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); 
  const drawerRef = useRef(null); 

  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uz', name: 'O‘zbekcha' },
  ];

 
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };


  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode); 
    setIsOpen(false);
    console.log("Language changed to:", langCode);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false); // Close the drawer
      }
    };

    // Add event listener when drawer is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when drawer is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when isOpen changes

  return (
    <>
      {/* Button to open the language drawer */}
      <button
        onClick={toggleDrawer}
        className="px-4 py-2 bg-blue-700 dark:bg-yellow-300 text-black rounded-lg shadow-md hover:bg-blue-800 dark:hover:bg-purple-950 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
    
    <TranslateIcon className=" h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleDrawer} 
        ></div>
      )}

   
      <div
        ref={drawerRef} // Attach ref for click outside detection
        className={`
          fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col p-6
        `}
      >
   
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
          aria-label="Close language selector"
        >
          &times; 
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white mt-10">Select Language</h2>

     
        <nav className="flex flex-col space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`
                px-4 py-3 rounded-lg text-left text-lg font-medium
                ${i18n.language === lang.code
                  ? 'bg-blue-600 dark:bg-yellow-300 text-black'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-200
              `}
            >
              {lang.name}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
