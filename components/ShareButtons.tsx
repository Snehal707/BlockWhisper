'use client';

import { motion } from 'framer-motion';

interface ShareButtonsProps {
    fortune: string;
}

export function ShareButtons({ fortune }: ShareButtonsProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleTwitterShare = () => {
        const text = `I just revealed my onchain fortune on BlockWhisper! 🔮✨\n\n"${fortune}"\n\nCheck yours at:`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const handleFarcasterShare = () => {
        const text = `I just revealed my onchain fortune on BlockWhisper! 🔮\n\n"${fortune}"`;
        const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleTelegramShare = () => {
        const text = `I just revealed my onchain fortune on BlockWhisper! 🔮\n\n"${fortune}"`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
            >
                <div className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-900 dark:text-white/90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                </div>

                <div className="flex gap-3 sm:gap-4 justify-center w-full">
                    {/* X (Twitter) */}
                    <button
                        onClick={handleTwitterShare}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-black hover:bg-zinc-800 rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 shadow-md border border-black/5 dark:border-white/5 group overflow-hidden"
                    >
                        <img
                            src="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
                            alt="X"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {/* Telegram */}
                    <button
                        onClick={handleTelegramShare}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2AABEE] hover:bg-[#229ED9] rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 shadow-md group overflow-hidden"
                    >
                        <img
                            src="https://pbs.twimg.com/profile_images/1183117696730390529/LRDASku7_400x400.jpg"
                            alt="Telegram"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {/* Base (Copy Link context) */}
                    <button
                        onClick={handleCopyLink}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0052FF] hover:bg-[#004AD9] rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 shadow-md group relative overflow-hidden"
                    >
                        <img
                            src="https://pbs.twimg.com/profile_images/1945608199500910592/rnk6ixxH_400x400.jpg"
                            alt="Base"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {/* Farcaster */}
                    <button
                        onClick={handleFarcasterShare}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#855DCD] hover:bg-[#7C55C3] rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 shadow-md group overflow-hidden"
                    >
                        <img
                            src="https://pbs.twimg.com/profile_images/1980310281558409216/DWoYcKR7_400x400.jpg"
                            alt="Farcaster"
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
