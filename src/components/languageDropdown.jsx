import React, { useState, useEffect } from 'react';

import { TranslateIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';



export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' },
        { code: 'uz', name: 'O‘zbekcha' },
    ];

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    // Effect to prevent body scroll when the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Button to open the language selector */}
            <button
                onClick={toggleModal}
                className="p-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-full shadow-sm hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Open language selector"
            >
                <TranslateIcon className="h-6 w-6" />
            </button>

            {/* Modal with Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-end"
                    // The main div acts as the overlay
                    onClick={toggleModal}
                >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/40 animate-fade-in"></div>

                    {/* Action Sheet Content */}
                    <div
                        // Stop propagation to prevent clicks inside from closing the modal
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full px-4 pb-4 animate-slide-up"
                    >
                        {/* Language Options Group */}
                        <div className="w-full max-w-md mx-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-xl overflow-hidden">
                            {languages.map((lang, index) => (
                                <button
                                    key={lang.code}
                                    onClick={() => selectLanguage(lang.code)}
                                    className={`w-full p-4 text-center text-lg transition-colors duration-200
                                        ${i18n.language === lang.code
                                            ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                            : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                                        }
                                        ${index < languages.length - 1 ? 'border-b border-gray-300/50 dark:border-zinc-700/50' : ''}
                                    `}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>

                        {/* Cancel Button */}
                        <div className="w-full max-w-md mx-auto mt-3">
                            <button
                                onClick={toggleModal}
                                className="w-full p-4 text-center text-lg font-semibold bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-xl text-purple-600 dark:text-purple-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom keyframes for animations */}
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}
