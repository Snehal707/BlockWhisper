
import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { searchParams }: Props,
): Promise<Metadata> {
    const fortune = searchParams.fortune as string | undefined;

    const title = fortune ? 'My Onchain Fortune' : 'BlockWhisper';
    const description = fortune ? `"${fortune}"` : 'Reveal your destiny based on your onchain activity.';

    // Use Vercel OG or similar service for dynamic image
    const ogImage = `/api/og?fortune=${encodeURIComponent(fortune || '')}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        other: {
            'fc:frame': 'vNext',
            'fc:frame:image': ogImage,
            'fc:frame:button:1': 'Get Yours',
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': 'https://block-whisper.vercel.app', // Update with actual URL or use relative if supported (Frames need absolute usually)
        },
    };
}

export default function Page({ searchParams }: Props) {
    const fortune = searchParams.fortune as string | undefined;

    return <HomeClient initialFortune={fortune} />;
}
