'use client';

import { useIsMiniApp } from '@/hooks/useIsMiniApp';
import FarcasterClient from '@/app/mini/farcaster/client';
import { NotificationToggle } from './NotificationToggle';
import WebClient from '@/app/web/client';

interface HomeClientProps {
    initialFortune?: string | null;
}

export default function HomeClient({ initialFortune }: HomeClientProps) {
    const isMiniApp = useIsMiniApp();

    // Clean Router Logic
    if (isMiniApp) {
        return <FarcasterClient initialFortune={initialFortune} />;
    }

    return <WebClient initialFortune={initialFortune} />;
}
