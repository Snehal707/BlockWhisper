import { motion } from 'framer-motion';

interface FortuneCardProps {
    displayFortune: string;
    onMint?: () => void;
}

export function FortuneCard({ displayFortune, onMint }: FortuneCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 pb-16 max-w-md w-full text-center relative z-10 border-2 border-purple-500/30"
        >
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-300 dark:via-purple-300 dark:to-indigo-300">
                Your Onchain Fortune
            </h3>

            <div className="prose prose-invert">
                <p className="text-lg leading-relaxed italic text-gray-800 dark:text-gray-200">
                    "{displayFortune}"
                </p>
            </div>

            {onMint && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onMint}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold hover:opacity-90 transition-opacity"
                    >
                        Mint Card (Gasless)
                    </button>
                </div>
            )}
        </motion.div>
    );
}
