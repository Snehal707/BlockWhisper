'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

const OBJECT_MAP: Record<string, string> = {
    // General Mystical
    'default': '✨',
    'star': '⭐',
    'moon': '🌙',
    'cloud': '☁️',
    'crystal': '🔮',

    // Crypto/Fortune Specific
    'bull': '🐂',
    'bear': '🐻',
    'rocket': '🚀',
    'money': '💰',
    'fire': '🔥',
    'skull': '💀',
    'chart': '📈',
    'lock': '🔒',
    'key': '🔑',
    'diamond': '💎',
    'hands': '🙌',
};

interface FloatingObjectsProps {
    keywords?: string[];
}

export function FloatingObjects({ keywords = [] }: FloatingObjectsProps) {
    const { theme } = useTheme();
    const [elements, setElements] = useState<{
        id: number;
        char: string;
        x: number;
        y: number;
        duration: number;
        delay: number;
        scale: number;
        blur: string;
    }[]>([]);

    useEffect(() => {
        // Map keywords to emojis
        let chars = keywords
            .map(k => OBJECT_MAP[k] || OBJECT_MAP[k.toLowerCase()] || '✨')
            .filter(Boolean);

        if (chars.length === 0) {
            chars = ['✨', '🌙', '🔮', '✨', '☁️', '⭐'];
        }

        // Duplicate to fill screen
        while (chars.length < 15) {
            chars = [...chars, ...chars];
        }

        chars = chars.slice(0, 15);

        // Generate positions using a grid to ensure even distribution
        // 5 columns x 3 rows = 15 cells
        const cols = 5;
        const rows = 3;
        const cellWidth = window.innerWidth / cols;
        const cellHeight = window.innerHeight / rows;

        const newElements = chars.map((char, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);

            return {
                id: i,
                char,
                x: (col * cellWidth) + (Math.random() * (cellWidth * 0.6)),
                y: (row * cellHeight) + (Math.random() * (cellHeight * 0.6)),
                duration: 15 + Math.random() * 15, // Varied speeds
                delay: Math.random() * 5,
                // Add depth factors
                scale: 0.8 + Math.random() * 0.4,
                blur: Math.random() > 0.5 ? 'blur-[1px]' : 'blur-none',
            };
        });

        // Shuffle
        for (let i = newElements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newElements[i], newElements[j]] = [newElements[j], newElements[i]];
        }

        setElements(newElements);
    }, [keywords]);

    if (elements.length === 0) return null;

    const opacityRange = theme === 'dark' ? [0.1, 0.4, 0.1] : [0.3, 0.7, 0.3];

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className={`absolute text-5xl ${el.blur}`}
                    initial={{ x: el.x, y: el.y, scale: 0 }}
                    animate={{
                        // Vertical drift (gentle hover)
                        y: [el.y, el.y - 40 - Math.random() * 40, el.y],
                        // Horizontal sway
                        x: [el.x, el.x + 20 + Math.random() * 20, el.x - 20 - Math.random() * 20, el.x],
                        rotate: [0, 5, -5, 0],
                        scale: [el.scale, el.scale * 1.05, el.scale],
                        opacity: opacityRange
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: el.delay,
                        // Separate ease for x to create non-linear path
                        x: {
                            duration: el.duration * 0.8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }
                    }}
                >
                    {el.char}
                </motion.div>
            ))}
        </div>
    );
}
