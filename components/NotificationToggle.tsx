import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationToggle() {
    const [enabled, setEnabled] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('blockwhisper_notifications_enabled');
        if (stored === 'true') {
            setEnabled(true);
        }
    }, []);

    const toggleNotifications = () => {
        const newState = !enabled;
        setEnabled(newState);
        localStorage.setItem('blockwhisper_notifications_enabled', String(newState));

        // Show toast feedback
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full transition-colors relative ${enabled
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                aria-label={enabled ? "Disable notifications" : "Enable notifications"}
            >
                <svg
                    className="w-5 h-5"
                    fill={enabled ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* Status Indicator Dot */}
                {enabled && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-white dark:border-black"></span>
                )}
            </button>

            {/* Toast Feedback */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -10, x: '-50%' }}
                        className="absolute top-12 left-1/2 transform -translate-x-1/2 w-max max-w-[200px] z-50 text-center pointer-events-none"
                    >
                        <div className="px-3 py-2 bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs font-medium rounded-lg shadow-xl backdrop-blur-sm">
                            {enabled ? (
                                <>
                                    <p>Preference Saved ✅</p>
                                    <p className="opacity-75 text-[10px] mt-0.5">System notifications coming soon</p>
                                </>
                            ) : (
                                <p>Reminders disabled</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
