'use client';

import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Toggle theme"
        >
            <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: theme === 'dark' ? 0 : 24 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? (
                    <span className="text-xs">🌙</span>
                ) : (
                    <span className="text-xs">☀️</span>
                )}
            </motion.div>
        </motion.button>
    );
}
