import { NextRequest, NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/chain-data';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; // Keep this line if ALCHEMY_API_KEY is used elsewhere in the file, otherwise remove.
// ALCHEMY_URL is no longer needed here.

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    // console.log removed

    if (!address) {
        return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }
    // The ALCHEMY_API_KEY check is now handled within getRecentActivity or is no longer needed here.

    try {
        const activity = await getRecentActivity(address);

        console.log('✅ Activity fetched via lib/chain-data:');
        console.log(`  Total: ${activity.totalCount}`);
        console.log(`  ETH: ${activity.transactions.length}, Tokens: ${activity.tokens.length}, NFTs: ${activity.nfts.length}`);

        return NextResponse.json({
            transactions: activity.transactions,
            tokenTransfers: activity.tokens,
            nftTransfers: activity.nfts,
            sent: activity.sent,
            received: activity.received,
            totalCount: activity.totalCount,
        });

    } catch (error) {
        console.error('❌ Error in /api/stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
