
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
    description: 'Your onchain fortune awaits.',
    other: {
        'fc:miniapp': JSON.stringify({
            version: '1',
            imageUrl: 'https://blockwhisper.vercel.app/splash.png',
            button: {
                title: 'Reveal Your Fortune',
                action: {
                    type: 'launch_frame',
                    name: 'BlockWhisper',
                    url: 'https://blockwhisper.vercel.app',
                    splashImageUrl: 'https://blockwhisper.vercel.app/splash.png',
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
            <body className={inter.className}>
                <ThemeProvider>
                    <FarcasterProvider>
                        <OnchainProviders>{children}</OnchainProviders>
                    </FarcasterProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
