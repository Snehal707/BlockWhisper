'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Activity, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsProps {
    address: string;
    isOpen: boolean;
    onClose: () => void;
}

type EnergyLevel = 'Low' | 'Medium' | 'High';
type MovementLevel = 'Still' | 'Active' | 'Restless';
type RiskLevel = 'Safe' | 'Balanced' | 'Bold';
type FlowLevel = 'Inflow' | 'Outflow' | 'Neutral';

interface QualitativeStats {
    energy: EnergyLevel;
    movement: MovementLevel;
    risk: RiskLevel;
    flow: FlowLevel;
}

export function UserStats({ address, isOpen, onClose }: StatsProps) {
    const [stats, setStats] = useState<QualitativeStats>({
        energy: 'Low',
        movement: 'Still',
        risk: 'Safe',
        flow: 'Neutral'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && address) {
            fetchStats();
        }
    }, [isOpen, address]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Call the API route to get Basescan data
            const response = await fetch(`/api/stats?address=${address}`);

            if (!response.ok) {
                console.error('Failed to fetch stats:', response.statusText);
                setLoading(false);
                return;
            }

            const data = await response.json();
            const txs = data.transactions || [];
            const tokens = data.tokenTransfers || [];
            const nfts = data.nftTransfers || [];
            const sent = data.sent || [];
            const received = data.received || [];
            const totalCount = data.totalCount || 0;

            console.log('Stats fetched:', {
                txs: txs.length,
                tokens: tokens.length,
                nfts: nfts.length,
                sent: sent.length,
                received: received.length,
                totalCount
            });

            // Calculate Energy: Based on total activity
            let energy: EnergyLevel = 'Low';
            if (totalCount >= 10) energy = 'High';
            else if (totalCount >= 3) energy = 'Medium';

            // Calculate Movement: Based on transaction count
            let movement: MovementLevel = 'Still';
            if (totalCount >= 6) movement = 'Restless';
            else if (totalCount >= 2) movement = 'Active';

            // Calculate Risk: Based on contract interactions (NFTs + tokens) vs simple ETH
            const complexTxs = tokens.length + nfts.length;
            let risk: RiskLevel = 'Safe';
            if (complexTxs > txs.length) risk = 'Bold';
            else if (complexTxs > 0) risk = 'Balanced';

            // Calculate Flow: Based on sent vs received
            let flow: FlowLevel = 'Neutral';
            if (received.length > sent.length * 1.3) flow = 'Inflow';
            else if (sent.length > received.length * 1.3) flow = 'Outflow';

            setStats({ energy, movement, risk, flow });
        } catch (e) {
            console.error('Error fetching stats:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
                        style={{
                            background: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 50%, #0f0520 100%)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>

                        <div className="relative z-10 flex flex-col h-full p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                                    >
                                        24h Aura
                                    </motion.h2>
                                    <p className="text-gray-400 text-sm mt-1">Your onchain essence</p>
                                    <a
                                        href={`https://basescan.org/address/${address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-flex items-center gap-1 hover:underline"
                                    >
                                        View on Basescan ↗
                                    </a>
                                    <p className="text-gray-500 text-xs mt-1 font-mono">
                                        {(() => {
                                            const now = new Date();
                                            const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                                            const fmt = (d: Date) => d.toUTCString().replace(/:\d{2} GMT/, ' UTC').replace(/^.*,\s/, '');
                                            return `${fmt(dayAgo)} → ${fmt(now)}`;
                                        })()}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {loading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-6xl"
                                    >
                                        🔮
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="flex-1 space-y-4 overflow-y-auto">
                                    <QualitativeStatCard
                                        label="Energy"
                                        value={stats.energy}
                                        description="Total actions & gas"
                                        icon={<Zap className="w-6 h-6" />}
                                        gradient={stats.energy === 'High' ? 'from-yellow-500 to-orange-600' : stats.energy === 'Medium' ? 'from-yellow-400 to-yellow-600' : 'from-gray-500 to-gray-600'}
                                        delay={0.1}
                                    />
                                    <QualitativeStatCard
                                        label="Movement"
                                        value={stats.movement}
                                        description="Transactions & interactions"
                                        icon={<Activity className="w-6 h-6" />}
                                        gradient={stats.movement === 'Restless' ? 'from-purple-500 to-pink-600' : stats.movement === 'Active' ? 'from-blue-500 to-purple-500' : 'from-gray-500 to-gray-600'}
                                        delay={0.2}
                                    />
                                    <QualitativeStatCard
                                        label="Risk"
                                        value={stats.risk}
                                        description="DeFi vs simple transfers"
                                        icon={<Shield className="w-6 h-6" />}
                                        gradient={stats.risk === 'Bold' ? 'from-red-500 to-orange-600' : stats.risk === 'Balanced' ? 'from-blue-500 to-cyan-600' : 'from-green-500 to-emerald-600'}
                                        delay={0.3}
                                    />
                                    <QualitativeStatCard
                                        label="Flow"
                                        value={stats.flow}
                                        description="Net value direction"
                                        icon={stats.flow === 'Inflow' ? <TrendingUp className="w-6 h-6" /> : stats.flow === 'Outflow' ? <TrendingDown className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                                        gradient={stats.flow === 'Inflow' ? 'from-green-500 to-emerald-600' : stats.flow === 'Outflow' ? 'from-orange-500 to-red-600' : 'from-gray-500 to-gray-600'}
                                        delay={0.4}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function QualitativeStatCard({ label, value, description, icon, gradient, delay }: {
    label: string,
    value: string,
    description: string,
    icon: React.ReactNode,
    gradient: string,
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-6 rounded-3xl relative overflow-hidden group cursor-pointer"
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-gray-500 text-xs">{description}</p>
                    </div>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>

                <motion.div
                    key={value}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}
                >
                    {value}
                </motion.div>
            </div>

            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
        </motion.div>
    );
}
