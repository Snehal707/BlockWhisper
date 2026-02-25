
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { OnchainProviders } from '@/components/OnchainProviders';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FarcasterProvider } from '@/components/FarcasterProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'BlockWhisper',
    description: 'Connect your wallet to reveal what the blockchain spirits say about your past 24 hours on Base.',
    other: {
        'base:app_id': '6991c25ae0d5d2cf831b5cd3',
        'fc:miniapp': JSON.stringify({
            version: '1',
            imageUrl: 'https://block-whisper.vercel.app/icon.png',
            button: {
                title: 'Reveal Your Fortune',
                action: {
                    type: 'launch_frame',
                    name: 'BlockWhisper',
                    url: 'https://block-whisper.vercel.app',
                    splashImageUrl: 'https://block-whisper.vercel.app/icon.png',
                    splashBackgroundColor: '#0a0a1f',
                },
            },
        }),
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider>
                    <FarcasterProvider>
                        <OnchainProviders>{children}</OnchainProviders>
                    </FarcasterProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
