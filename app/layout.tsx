
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
