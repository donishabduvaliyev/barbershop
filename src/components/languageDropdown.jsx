import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
                className="p-2 bg-surface-2 text-text-muted rounded-full shadow-sm hover:bg-surface-3 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Open language selector"
            >
                <TranslateIcon className="h-6 w-6" />
            </button>

            {/* Modal with Overlay */}
            {isOpen && createPortal(
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
                        <div className="w-full max-w-md mx-auto bg-surface/90 backdrop-blur-xl rounded-xl overflow-hidden ">
                            {languages.map((lang, index) => (
                                <button
                                    key={lang.code}
                                    onClick={() => selectLanguage(lang.code)}
                                    className={`w-full p-4 text-center text-lg transition-colors duration-200
                                        ${i18n.language === lang.code
                                            ? 'text-accent font-semibold'
                                            : 'text-text hover:bg-surface-2'
                                        }
                                        ${index < languages.length - 1 ? 'border-b border-border-soft' : ''}
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
                                className="w-full p-4 text-center text-lg font-semibold bg-surface/90 backdrop-blur-xl rounded-xl text-accent hover:bg-surface-2 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
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
