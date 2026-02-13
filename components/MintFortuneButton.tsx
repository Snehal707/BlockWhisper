'use client';

import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { encodeFunctionData } from 'viem';
import { useTheme } from './ThemeProvider';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface MintFortuneButtonProps {
    fortune: string;
}

export function MintFortuneButton({ fortune }: MintFortuneButtonProps) {
    const { theme } = useTheme();

    const mintABI = [
        {
            inputs: [
                { internalType: 'string[]', name: 'fortuneLines', type: 'string[]' },
                { internalType: 'string', name: 'themeColor', type: 'string' },
                { internalType: 'string', name: 'emoji', type: 'string' }
            ],
            name: 'mint',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ] as const;

    // Split text into lines
    const splitText = (text: string, maxLength: number = 32): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + 1 + words[i].length <= maxLength) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines.slice(0, 10); // Max 10 lines
    };

    // Generate theme based on fortune content
    const generateTheme = (text: string): { color: string; emoji: string } => {
        const lower = text.toLowerCase();

        // Bullish/Growth themes
        if (lower.match(/bull|moon|rocket|up|growth|gain|profit|success|rich/)) {
            return { color: '#22c55e', emoji: '🚀' }; // Green
        }
        // Bearish/Caution themes
        if (lower.match(/bear|down|crash|loss|caution|careful|warning/)) {
            return { color: '#ef4444', emoji: '🐻' }; // Red
        }
        // Wisdom/Mystery themes
        if (lower.match(/wise|mystery|secret|hidden|unknown|oracle|spirit/)) {
            return { color: '#8b5cf6', emoji: '🔮' }; // Purple
        }
        // Water/Flow themes
        if (lower.match(/flow|water|wave|tide|ocean|river/)) {
            return { color: '#06b6d4', emoji: '🌊' }; // Cyan
        }
        // Fire/Energy themes
        if (lower.match(/fire|energy|power|strong|force|burn/)) {
            return { color: '#f59e0b', emoji: '🔥' }; // Orange
        }
        // Default: Crystal ball purple
        return { color: '#a855f7', emoji: '🔮' };
    };

    const fortuneLines = splitText(fortune);
    const fortuneTheme = generateTheme(fortune);

    const calls = [
        {
            to: CONTRACT_ADDRESS,
            data: encodeFunctionData({
                abi: mintABI,
                functionName: 'mint',
                args: [fortuneLines, fortuneTheme.color, fortuneTheme.emoji],
            }),
        },
    ];

    return (
        <div className="w-full max-w-xs mx-auto">
            <Transaction
                chainId={8453} // Base Mainnet
                calls={calls}
                capabilities={{
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_URL || '',
                    },
                }}
            >
                <div style={{ color: theme === 'light' ? '#000000' : '#ffffff' }} className="w-full [&_button]:!text-inherit">
                    <TransactionButton
                        className={`rounded-full font-bold hover:opacity-90 transition-opacity w-full py-3 shadow-[0_0_20px_rgba(124,58,237,0.5)] ${theme === 'light'
                                ? 'bg-gradient-to-r from-blue-300 to-purple-300'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600'
                            }`}
                        text="Mint Fortune NFT"
                    />
                </div>
                <TransactionStatus>
                    <TransactionStatusLabel />
                </TransactionStatus>
            </Transaction>
        </div>
    );
}
