'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const output = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: 'BlockWhisper',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
    ssr: true,
});

export function OnchainProviders({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={output}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    chain={base}
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
