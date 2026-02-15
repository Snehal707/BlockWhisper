"use client"
import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export function useIsMiniApp(): boolean {
    const [isMiniApp, setIsMiniApp] = useState(false)

    useEffect(() => {
        let mounted = true

        // Check if running in browser
        if (typeof window !== 'undefined') {
            try {
                // @ts-ignore - The SDK types might be outdated, but trust user's call
                sdk.isInMiniApp()
                    .then((v: boolean) => { if (mounted) setIsMiniApp(!!v) })
                    .catch(() => { if (mounted) setIsMiniApp(false) })

            } catch (e) {
                console.error("Error checking mini app status:", e);
                if (mounted) setIsMiniApp(false);
            }
        }

        return () => { mounted = false }
    }, [])

    return isMiniApp
}
