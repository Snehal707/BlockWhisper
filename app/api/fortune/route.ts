import { NextRequest, NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/chain-data';
import { generateFortune } from '@/lib/nous';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        // 1. Fetch activity (last 24h) via Alchemy
        const activity = await getRecentActivity(address);

        // 2. Analyze activity
        let summary = `No activity in last 24 hours. The address is ${address}.`;

        if (activity.totalCount > 0) {
            const uniqueInteractions = new Set([
                ...activity.sent.map(tx => tx.to),
                ...activity.received.map(tx => tx.from)
            ].filter(Boolean));

            const totalVolume = activity.raw.reduce((acc, tx) => acc + (tx.value || 0), 0);

            summary = `User activity (last 24h):
      - Total Actions: ${activity.totalCount}
      - Transactions (ETH): ${activity.transactions.length}
      - Token Transfers: ${activity.tokens.length}
      - NFT Interactions: ${activity.nfts.length}
      - Unique Contracts/Peers: ${uniqueInteractions.size}
      - Approx Volume Moved: ${totalVolume.toFixed(4)} ETH/Tokens
      - Activity Type: ${activity.sent.length > activity.received.length ? 'Mostly Sending' : 'Mostly Receiving'}
      `;
        }

        console.log('🔮 Generating fortune for:', address);
        console.log('📝 Summary:', summary);

        // 3. Generate Fortune via LLM
        const fortuneData = await generateFortune(summary);

        return NextResponse.json({
            address,
            activitySummary: summary,
            fortune: fortuneData.fortune,
            keywords: fortuneData.keywords
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
