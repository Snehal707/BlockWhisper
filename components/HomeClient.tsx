'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
    Avatar,
    Identity,
    Address,
    EthBalance,
    Name,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sdk } from '@farcaster/miniapp-sdk';
import { useIsMiniApp } from '@/hooks/useIsMiniApp';
import { FloatingObjects } from '@/components/FloatingObjects';
import { FortuneCard } from './FortuneCard';
import { MintFortuneButton } from './MintFortuneButton';
import { ShareButtons } from './ShareButtons';
import { ThemeToggle } from './ThemeToggle';
import { TransactionHistory } from './TransactionHistory';
import { UserStats } from './UserStats';
import { BarChart3 } from 'lucide-react';

interface HomeClientProps {
    initialFortune?: string | null;
}

export default function HomeClient({ initialFortune }: HomeClientProps) {
    const { address, isConnected } = useAccount();
    const [fortune, setFortune] = useState<string | null>(initialFortune || null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [fcUser, setFcUser] = useState<{
        username?: string;
        displayName?: string;
        pfpUrl?: string;
    }>({});

    // Mini App Detection
    const isMiniApp = useIsMiniApp();

    // Dynamic styles based on environment
    const shellClass = isMiniApp
        ? "relative h-[100dvh] w-full overflow-hidden flex flex-col items-center p-4"
        : "relative min-h-screen w-full overflow-x-hidden";

    const bodyWrapClass = isMiniApp
        ? "relative z-10 w-full max-w-md mx-auto flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-6"
        : "relative z-10 w-full max-w-6xl mx-auto px-12 pt-16 pb-16";

    const headerWrapClass = isMiniApp
        ? "z-20 w-full max-w-md mx-auto flex items-center justify-between gap-2 pt-2 pb-2 px-4"
        : "z-20 w-full max-w-6xl mx-auto flex items-center justify-between gap-6 pt-6 pb-4 px-12";

    const footerClass = isMiniApp
        ? "py-4 text-center text-gray-500 text-sm"
        : "py-6 text-center text-gray-500 text-base";

    useEffect(() => {
        const loadUser = async () => {
            try {
                const context = await sdk.context;
                if (context?.user) {
                    setFcUser(context.user);
                }
            } catch (err) {
                console.error('Error loading Farcaster context:', err);
            }
        };
        loadUser();
    }, []);

    const handleReveal = async () => {
        if (!address) return;
        setLoading(true);
        try {
            const res = await fetch('/api/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            });
            const data = await res.json();
            setFortune(data.fortune);
            setKeywords(data.keywords || []);
        } catch (e) {
            console.error(e);
            setFortune("The stars are cloudy... try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className={shellClass}
            style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
        >
            <UserStats
                address={address || ''}
                isOpen={isStatsOpen}
                onClose={() => setIsStatsOpen(false)}
            />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse opacity-50"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <FloatingObjects keywords={keywords.length > 0 ? keywords : ['star', 'moon', 'crystal']} />

            {/* Header */}
            <div className={headerWrapClass}>
                <div className="flex items-center justify-between gap-2 pointer-events-auto w-full">
                    <div className="min-w-0 flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${isMiniApp ? "text-base" : "text-2xl md:text-3xl"} font-bold whitespace-nowrap leading-none`}
                        >
                            <span style={{
                                backgroundImage: 'var(--gradient-title)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                Block
                            </span>
                            <span style={{ color: 'var(--text-primary)' }}>Whisper</span>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isConnected && (
                            <motion.button
                                onClick={() => setIsStatsOpen(true)}
                                className="relative group p-3 rounded-2xl transition-all duration-300 overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                title="View Your 24h Aura"
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Crystal Ball Icon */}
                                <motion.svg
                                    className="w-5 h-5 relative z-10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {/* Crystal Ball */}
                                    <circle
                                        cx="12"
                                        cy="11"
                                        r="7"
                                        stroke="url(#statsGradient)"
                                        strokeWidth="1.5"
                                        fill="none"
                                        className="group-hover:fill-purple-500/10 transition-all"
                                    />

                                    {/* Inner glow circle */}
                                    <circle
                                        cx="12"
                                        cy="11"
                                        r="4"
                                        stroke="url(#statsGradient)"
                                        strokeWidth="1"
                                        fill="none"
                                        opacity="0.5"
                                        className="group-hover:opacity-100 transition-opacity"
                                    />

                                    {/* Chart bars inside */}
                                    <rect x="9" y="9" width="1.5" height="4" fill="url(#statsGradient)" rx="0.5" />
                                    <rect x="11.5" y="7" width="1.5" height="6" fill="url(#statsGradient)" rx="0.5" />
                                    <rect x="14" y="10" width="1.5" height="3" fill="url(#statsGradient)" rx="0.5" />

                                    {/* Base/stand */}
                                    <path
                                        d="M7 18 Q12 19 17 18"
                                        stroke="url(#statsGradient)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                    <ellipse cx="12" cy="18" rx="2" ry="0.5" fill="url(#statsGradient)" opacity="0.3" />

                                    <defs>
                                        <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#2563EB" />
                                            <stop offset="50%" stopColor="#7C3AED" />
                                            <stop offset="100%" stopColor="#DB2777" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>

                                {/* Pulse effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3), rgba(244, 114, 182, 0.3))',
                                        filter: 'blur(8px)',
                                    }}
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.button>
                        )}
                        <ThemeToggle />
                        {isConnected && !isMiniApp && (
                            <Wallet>
                                <ConnectWallet className="bg-transparent border border-white/10 hover:bg-white/5 rounded-full px-4 py-2">
                                    <Avatar className="h-6 w-6" />
                                    <Name className="text-white" />
                                </ConnectWallet>
                                <WalletDropdown>
                                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                        <Avatar />
                                        <Name />
                                        <Address />
                                        <EthBalance />
                                    </Identity>
                                    <WalletDropdownDisconnect />
                                </WalletDropdown>
                            </Wallet>
                        )}
                    </div>
                </div>

                {/* Second Row: Farcaster Identity (Mini App Only) */}
                {isMiniApp && (
                    <div className="mt-2 flex justify-end pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
                        >
                            {fcUser.pfpUrl && (
                                <img
                                    src={fcUser.pfpUrl}
                                    alt={fcUser.username}
                                    className="w-5 h-5 rounded-full"
                                />
                            )}
                            <span className="text-xs font-medium truncate max-w-[120px]" style={{ color: 'var(--text-secondary)' }}>
                                @{fcUser.username || "anon"}
                            </span>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Main Scroll Container */}
            {/* Main Scroll Container */}
            <div className={bodyWrapClass}>
                <div className="flex flex-col items-center gap-6">
                    {/* Main Content */}
                    <div className="relative w-full">
                        <div className={isMiniApp ? "flex flex-col items-center gap-4" : "flex flex-col items-center gap-8 text-center"}>
                            {!isConnected && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ y: [0, -20, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className={`${isMiniApp ? "text-6xl mb-2" : "text-8xl mb-4"} filter drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]`}
                                        >
                                            🔮
                                        </motion.div>
                                        <div className="absolute -inset-4 bg-purple-500/20 blur-3xl -z-10 rounded-full"></div>
                                    </div>

                                    <h1 className={`${isMiniApp ? "text-4xl mb-4" : "text-6xl md:text-8xl mb-8"} font-bold tracking-tighter`}>
                                        <span className="block mb-2"
                                            style={{
                                                backgroundImage: 'var(--gradient-title)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                                backgroundSize: '200% auto',
                                            }}>
                                            Your Chain.
                                        </span>
                                        <span className="block"
                                            style={{
                                                backgroundImage: 'var(--gradient-title-reverse)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                                backgroundSize: '200% auto',
                                            }}>
                                            Your Destiny.
                                        </span>
                                    </h1>

                                    <p className={`${isMiniApp ? "text-base max-w-sm" : "text-xl max-w-2xl"} mx-auto leading-relaxed`} style={{ color: 'var(--text-secondary)' }}>
                                        {isMiniApp
                                            ? "Reveal what the blockchain spirits say about your history."
                                            : <>Connect your wallet to reveal what the <span className="font-semibold text-purple-400">blockchain spirits</span> say about your past 24 hours on Base.</>
                                        }
                                    </p>

                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`${isMiniApp ? "text-xs mt-4" : "text-sm font-mono mt-8"}`}
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        ↓ Connect to begin ↓
                                    </motion.div>

                                    <div className="flex justify-center mt-6">
                                        <Wallet>
                                            <ConnectWallet className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                                                <span className="mr-2">Connect Wallet</span>
                                                <Avatar className="h-6 w-6" />
                                            </ConnectWallet>
                                        </Wallet>
                                    </div>
                                </motion.div>
                            )}

                            {isConnected && !fortune && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="text-6xl mb-4">✨</div>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
                                        Ready to <span className="text-purple-400">Whisper</span>?
                                    </h2>
                                    <button
                                        onClick={handleReveal}
                                        className="group relative w-full py-4 text-lg md:text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full font-bold shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:shadow-[0_0_60px_rgba(147,51,234,0.9)] transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            <span>Reveal My Fortune</span>
                                            <span className="group-hover:rotate-12 transition-transform">🌟</span>
                                        </span>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                                    </button>
                                </motion.div>
                            )}

                        </div>

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="text-8xl"
                                >
                                    🔮
                                </motion.div>
                                <div className="text-2xl text-purple-300 font-semibold">
                                    Reading the blockchain...
                                </div>
                                <div className="flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-3 h-3 bg-purple-500 rounded-full"
                                        ></motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {fortune && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-6 w-full"
                            >
                                <FortuneCard displayFortune={fortune || ""} />
                                <MintFortuneButton fortune={fortune} />
                                <ShareButtons fortune={fortune || ""} />
                            </motion.div>
                        )}

                        {/* Transaction History Section */}
                        {isConnected && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 w-full"
                            >
                                <TransactionHistory />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className={footerClass}
                >
                    <p>Built on <span className="text-blue-400 font-semibold">Base</span> • Powered by <span className="text-purple-400 font-semibold">Nous Hermes 3</span></p>
                </motion.div>
            </div>
        </main>
    );
}
