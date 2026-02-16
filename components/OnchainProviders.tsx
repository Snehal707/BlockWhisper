'use client';

import { ReactNode, useMemo } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { useIsMiniApp } from '../hooks/useIsMiniApp';

const queryClient = new QueryClient();

export function OnchainProviders({ children }: { children: ReactNode }) {
    const isMiniApp = useIsMiniApp();

    const config = useMemo(() => {
        const connectors = isMiniApp
            ? [farcasterFrame()]
            : [coinbaseWallet({ appName: "BlockWhisper" })];

        return createConfig({
            chains: [base],
            connectors,
            transports: {
                [base.id]: http(),
            },
            ssr: true,
        });
    }, [isMiniApp]);

    return (
        <WagmiProvider config={config} key={isMiniApp ? "miniapp" : "web"}>
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
