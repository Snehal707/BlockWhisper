import { NextResponse } from 'next/server';

export async function GET() {
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

    if (!ALCHEMY_API_KEY) {
        return NextResponse.json({
            status: 'error',
            message: 'ALCHEMY_API_KEY is not configured',
            configured: false,
            keyPreview: null
        });
    }

    // Test the API key by making a simple request
    const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

    try {
        const res = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "eth_blockNumber",
                params: []
            })
        });

        const data = await res.json();

        if (data.result) {
            return NextResponse.json({
                status: 'success',
                message: 'Alchemy API is working correctly',
                configured: true,
                keyPreview: `${ALCHEMY_API_KEY.substring(0, 8)}...${ALCHEMY_API_KEY.substring(ALCHEMY_API_KEY.length - 4)}`,
                latestBlock: parseInt(data.result, 16),
                network: 'Base Mainnet'
            });
        } else {
            return NextResponse.json({
                status: 'error',
                message: 'Alchemy API key is invalid or has issues',
                configured: true,
                keyPreview: `${ALCHEMY_API_KEY.substring(0, 8)}...${ALCHEMY_API_KEY.substring(ALCHEMY_API_KEY.length - 4)}`,
                error: data.error || 'Unknown error'
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to Alchemy API',
            configured: true,
            keyPreview: `${ALCHEMY_API_KEY.substring(0, 8)}...${ALCHEMY_API_KEY.substring(ALCHEMY_API_KEY.length - 4)}`,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
