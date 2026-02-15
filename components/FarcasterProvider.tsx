'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const initSDK = async () => {
            try {
                // Initialize the SDK
                await sdk.actions.ready();
                setIsSDKLoaded(true);
                console.log('Farcaster SDK initialized');
            } catch (error) {
                console.error('Error initializing Farcaster SDK:', error);
            }
        };

        initSDK();
    }, []);

    return <>{children}</>;
}
