'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const initSDK = async () => {
            try {
                // Initialize the SDK
                // Adding a small delay to ensure frame context is ready
                setTimeout(async () => {
                    console.log('Calling sdk.actions.ready()...');
                    await sdk.actions.ready();
                    setIsSDKLoaded(true);
                    console.log('Farcaster SDK initialized successfully');
                }, 500);
            } catch (error) {
                console.error('Error initializing Farcaster SDK:', error);
                // Retry once on error
                setTimeout(async () => {
                    try {
                        console.log('Retrying sdk.actions.ready()...');
                        await sdk.actions.ready();
                        setIsSDKLoaded(true);
                    } catch (e) {
                        console.error('Retry failed:', e);
                    }
                }, 2000);
            }
        };

        initSDK();
    }, []);

    return <>{children}</>;
}
