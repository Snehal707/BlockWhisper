'use client';

import { useIsMiniApp } from '@/hooks/useIsMiniApp';
import FarcasterClient from '@/app/mini/farcaster/client';
import WebClient from '@/app/web/client';

interface HomeClientProps {
    initialFortune?: string | null;
}

export default function HomeClient({ initialFortune }: HomeClientProps) {
    const isMiniApp = useIsMiniApp();

    if (isMiniApp) {
        return <FarcasterClient initialFortune={initialFortune} />;
    }

    return <WebClient initialFortune={initialFortune} />;
}
