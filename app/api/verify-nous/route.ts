import { NextResponse } from 'next/server';

export async function GET() {
    const NOUS_API_KEY = process.env.NOUS_API_KEY;
    const NOUS_API_URL = process.env.NOUS_API_URL || 'https://inference-api.nousresearch.com/v1/chat/completions';

    if (!NOUS_API_KEY) {
        return NextResponse.json({
            status: 'error',
            message: 'NOUS_API_KEY is not configured on Vercel environment variables',
            configured: false,
            url: NOUS_API_URL
        });
    }

    try {
        // Test connectivity with a minimal prompt
        const response = await fetch(NOUS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NOUS_API_KEY}`
            },
            body: JSON.stringify({
                model: "Hermes-4-405B",
                messages: [
                    { role: "user", content: "pong" }
                ],
                max_tokens: 5
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({
                status: 'error',
                message: `Nous API returned error ${response.status}`,
                configured: true,
                url: NOUS_API_URL,
                error: errorText.substring(0, 200)
            });
        }

        const data = await response.json();
        return NextResponse.json({
            status: 'success',
            message: 'Nous API is configured and responding correctly',
            configured: true,
            url: NOUS_API_URL,
            model: "Hermes-4-70B",
            responsePreview: data.choices?.[0]?.message?.content
        });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to Nous API',
            configured: true,
            url: NOUS_API_URL,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
