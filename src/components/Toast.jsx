import React, { useEffect } from 'react';
import { useAppContext } from '../context/context';

const Toast = () => {
    const { notification, clearNotification } = useAppContext();

    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(clearNotification, 4000);
        return () => clearTimeout(timer);
    }, [notification, clearNotification]);

    if (!notification) return null;

    const isError = notification.type === 'error';

    return (
        <div className="fixed top-4 left-1/2 z-[10000] w-[92%] max-w-sm animate-toast-in">
            <div
                className={`flex items-start gap-3 rounded-xl shadow-lg px-4 py-3 backdrop-blur-xl border ${isError
                        ? 'bg-red-500/90 border-red-400 text-white'
                        : 'bg-emerald-500/90 border-emerald-400 text-white'
                    }`}
            >
                <span className="text-lg leading-none">{isError ? '⚠️' : '✅'}</span>
                <p className="text-sm font-medium flex-1">{notification.message}</p>
                <button
                    onClick={clearNotification}
                    className="text-white/80 hover:text-white text-lg leading-none"
                >
                    &times;
                </button>
            </div>
            <style>{`
                @keyframes toast-in {
                    from { transform: translate(-50%, -20px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-toast-in { animation: toast-in 0.25s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Toast;
