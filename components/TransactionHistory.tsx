'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

interface NFT {
    tokenId: string;
    themeColor: string;
    emoji: string;
    txHash: string;
}

export function TransactionHistory() {
    const { address } = useAccount();
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    useEffect(() => {
        if (address && CONTRACT_ADDRESS) {
            loadNFTs();
        }
    }, [address, CONTRACT_ADDRESS]);

    const loadNFTs = async () => {
        if (!address) return;

        setLoading(true);
        setError(null);

        try {
            // Mock data for now - RPC endpoint is having issues
            // In production, this would query the blockchain
            const mockNFTs: NFT[] = [];

            setNfts(mockNFTs);
        } catch (err) {
            console.error('Failed to load NFTs:', err);
            setError('Unable to load transaction history at the moment.');
        } finally {
            setLoading(false);
        }
    };

    if (!address) {
        return (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                Connect your wallet to view transaction history
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Your Fortune NFTs
                </h2>
                <div className="text-center py-12 glass-panel">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!loading && nfts.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Your Fortune NFTs {nfts.length > 0 && `(${nfts.length})`}
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 glass-panel animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.map((nft, index) => (
                        <motion.div
                            key={nft.tokenId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative glass-panel p-4 hover:border-purple-500/50 transition-all"
                        >
                            <div
                                className="aspect-square rounded-lg mb-3 flex items-center justify-center text-6xl"
                                style={{ backgroundColor: nft.themeColor + '20' }}
                            >
                                {nft.emoji}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        #{nft.tokenId}
                                    </span>
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: nft.themeColor }}
                                    />
                                </div>

                                <a
                                    href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 block truncate"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View on Basescan →
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
