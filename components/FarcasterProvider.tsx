'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const initSDK = async () => {
            try {
                // Check for SDK in various locations as suggested
                const farcasterSdk = (window as any).sdk || (window as any).farcasterSdk || (window as any).miniAppSdk || sdk;

                if (farcasterSdk) {
                    console.log('SDK found:', farcasterSdk);
                    console.log('Calling sdk.actions.ready()...');
                    await farcasterSdk.actions.ready();
                    setIsSDKLoaded(true);
                    console.log('Farcaster SDK initialized successfully');
                } else {
                    console.error('Farcaster SDK not found on window or via import');
                }
            } catch (error) {
                console.error('Error initializing Farcaster SDK:', error);
            }
        };

        initSDK();
    }, []);

    return <>{children}</>;
}
