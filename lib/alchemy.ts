// Alchemy-based transaction fetcher for Base network
// Uses Alchemy's Enhanced API for reliable transaction fetching

export interface AlchemyTransfer {
    hash: string;
    from: string;
    to: string | null;
    value: number | null;
    asset: string | null;
    category: string;
    blockNum: string;
    metadata?: {
        blockTimestamp: string;
    };
    rawContract?: {
        address: string;
        value: string;
    };
}

export async function getAlchemyTransactions(address: string): Promise<{
    transactions: AlchemyTransfer[];
    sent: AlchemyTransfer[];
    received: AlchemyTransfer[];
}> {
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

    if (!ALCHEMY_API_KEY) {
        console.error('❌ ALCHEMY_API_KEY not set');
        return { transactions: [], sent: [], received: [] };
    }

    const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    console.log('🔗 Alchemy URL:', ALCHEMY_URL.replace(ALCHEMY_API_KEY, ALCHEMY_API_KEY.substring(0, 6) + '...'));

    try {
        // Fetch sent transactions
        console.log('📤 Fetching sent transactions for:', address);
        const sentBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getAssetTransfers',
            params: [{
                fromBlock: '0x0',
                toBlock: 'latest',
                fromAddress: address,
                category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
                withMetadata: true,
                excludeZeroValue: false,
                maxCount: '0x32',
                order: 'desc'
            }]
        };

        const sentResponse = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sentBody)
        });

        const sentText = await sentResponse.text();
        console.log('📤 Sent response status:', sentResponse.status);

        let sentData;
        try {
            sentData = JSON.parse(sentText);
        } catch {
            console.error('❌ Failed to parse sent response:', sentText.substring(0, 200));
            sentData = {};
        }

        if (sentData.error) {
            console.error('❌ Alchemy sent error:', JSON.stringify(sentData.error));
        }

        const sent: AlchemyTransfer[] = sentData.result?.transfers || [];
        console.log(`📤 Sent transfers found: ${sent.length}`);

        // Fetch received transactions
        console.log('📥 Fetching received transactions for:', address);
        const receivedBody = {
            jsonrpc: '2.0',
            id: 2,
            method: 'alchemy_getAssetTransfers',
            params: [{
                fromBlock: '0x0',
                toBlock: 'latest',
                toAddress: address,
                category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
                withMetadata: true,
                excludeZeroValue: false,
                maxCount: '0x32',
                order: 'desc'
            }]
        };

        const receivedResponse = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(receivedBody)
        });

        const receivedText = await receivedResponse.text();
        console.log('📥 Received response status:', receivedResponse.status);

        let receivedData;
        try {
            receivedData = JSON.parse(receivedText);
        } catch {
            console.error('❌ Failed to parse received response:', receivedText.substring(0, 200));
            receivedData = {};
        }

        if (receivedData.error) {
            console.error('❌ Alchemy received error:', JSON.stringify(receivedData.error));
        }

        const received: AlchemyTransfer[] = receivedData.result?.transfers || [];
        console.log(`📥 Received transfers found: ${received.length}`);

        // Filter for last 24 hours using metadata timestamp
        const oneDayAgoMs = Date.now() - 24 * 60 * 60 * 1000;

        const filterRecent = (txs: AlchemyTransfer[]) => {
            // If we have metadata timestamps, use them
            if (txs.length > 0 && txs[0].metadata?.blockTimestamp) {
                return txs.filter(tx => {
                    const txTime = new Date(tx.metadata?.blockTimestamp || 0).getTime();
                    return txTime >= oneDayAgoMs;
                });
            }
            // Otherwise return all (they're already ordered desc, limited to 50)
            return txs;
        };

        const recentSent = filterRecent(sent);
        const recentReceived = filterRecent(received);

        // Combine and deduplicate
        const allTxs = [...recentSent, ...recentReceived];
        const uniqueTxs = Array.from(new Map(allTxs.map(tx => [tx.hash, tx])).values());

        console.log('📊 Final transaction counts:', {
            sent: recentSent.length,
            received: recentReceived.length,
            total: uniqueTxs.length
        });

        if (uniqueTxs.length > 0) {
            console.log('🔍 Sample transaction:', JSON.stringify(uniqueTxs[0], null, 2));
        }

        return {
            transactions: uniqueTxs,
            sent: recentSent,
            received: recentReceived
        };
    } catch (error) {
        console.error('❌ Error fetching Alchemy transactions:', error);
        return { transactions: [], sent: [], received: [] };
    }
}
