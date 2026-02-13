
import { ImageResponse } from 'next/og';
// App router includes @vercel/og by default



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fortune = searchParams.get('fortune');

        if (!fortune) {
            return new ImageResponse(
                (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0a0a1e',
                            color: 'white',
                            backgroundImage: 'linear-gradient(to bottom right, #0a0a1e, #000000)',
                        }}
                    >
                        <div style={{ fontSize: 60, fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #c084fc)', backgroundClip: 'text', color: 'transparent' }}>
                            BlockWhisper
                        </div>
                        <div style={{ fontSize: 30, marginTop: 20, color: '#9ca3af' }}>
                            Your Onchain Fortune Awaits
                        </div>
                    </div>
                ),
                {
                    width: 1200,
                    height: 630,
                },
            );
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a1e',
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e1e3f 0%, #0a0a1e 100%)',
                        color: 'white',
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 40, color: '#c084fc' }}>
                        BlockWhisper Fortune
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 48,
                            fontStyle: 'normal',
                            color: 'white',
                            lineHeight: 1.4,
                            whiteSpace: 'pre-wrap',
                            maxWidth: '900px',
                            textShadow: '0 0 10px rgba(255,255,255,0.3)',
                        }}
                    >
                        "{fortune}"
                    </div>
                    <div style={{ fontSize: 24, marginTop: 60, color: '#60a5fa' }}>
                        base.org | onchainkit
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
