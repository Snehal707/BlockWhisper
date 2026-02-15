import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BlockWhisper - Reveal Your On-Chain Destiny';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    {/* Crystal Ball Icon Mock */}
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 60px rgba(168, 85, 247, 0.4)',
                            marginRight: 40,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 60,
                            }}
                        >
                            🔮
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 80,
                                fontWeight: 'bold',
                                background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            BlockWhisper
                        </div>
                        <div
                            style={{
                                fontSize: 30,
                                color: '#a0a0b0',
                                marginTop: 10,
                            }}
                        >
                            Daily Blockchain Fortunes on Base
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 40,
                        marginTop: 40,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: 24 }}>🛡️</span>
                        <span style={{ fontSize: 24, color: '#e2e8f0' }}>Base Native</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: 24 }}>✨</span>
                        <span style={{ fontSize: 24, color: '#e2e8f0' }}>AI Powered</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
