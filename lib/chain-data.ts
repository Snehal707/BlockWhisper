
interface Transfer {
    blockNum: string;
    hash: string;
    from: string;
    to: string;
    value: number | null;
    asset: string | null;
    category: string;
    uniqueId?: string;
    metadata: {
        blockTimestamp: string;
    };
}

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export async function getRecentActivity(address: string) {
    if (!ALCHEMY_API_KEY) {
        console.error('ALCHEMY_API_KEY missing');
        return { transactions: [], tokens: [], nfts: [], sent: [], received: [], totalCount: 0, raw: [] };
    }

    try {
        const fetchTransfers = async (fromAddr: string | null, toAddr: string | null) => {
            const params = {
                fromBlock: "0x0",
                toBlock: "latest",
                category: ["external", "erc20", "erc721", "erc1155"],
                withMetadata: true,
                maxCount: "0x3e8", // 1000
                excludeZeroValue: false
            };

            if (fromAddr) Object.assign(params, { fromAddress: fromAddr });
            if (toAddr) Object.assign(params, { toAddress: toAddr });

            const res = await fetch(ALCHEMY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 1,
                    jsonrpc: "2.0",
                    method: "alchemy_getAssetTransfers",
                    params: [params]
                })
            });
            const data = await res.json();
            return (data.result?.transfers || []) as Transfer[];
        };

        const [outgoing, incoming] = await Promise.all([
            fetchTransfers(address, null), // Sent
            fetchTransfers(null, address)  // Received
        ]);

        const allTransfers = [...outgoing, ...incoming];

        // Filter last 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recent = allTransfers.filter(tx => {
            if (!tx.metadata?.blockTimestamp) return false;
            return new Date(tx.metadata.blockTimestamp) >= oneDayAgo;
        });

        // Deduplicate by hash if needed (rare with separate directions but possible)
        const uniqueParams = new Set();
        const uniqueRecent = recent.filter(tx => {
            const key = `${tx.hash}-${tx.category}-${tx.uniqueId || ''}`;
            if (uniqueParams.has(key)) return false;
            uniqueParams.add(key);
            return true;
        });

        const transactions = uniqueRecent.filter(tx => tx.category === 'external');
        const tokens = uniqueRecent.filter(tx => tx.category === 'erc20');
        const nfts = uniqueRecent.filter(tx => tx.category === 'erc721' || tx.category === 'erc1155');

        const sent = uniqueRecent.filter(tx => tx.from.toLowerCase() === address.toLowerCase());
        const received = uniqueRecent.filter(tx => tx.to?.toLowerCase() === address.toLowerCase());

        return {
            transactions,
            tokens,
            nfts,
            sent,
            received,
            totalCount: uniqueRecent.length,
            raw: uniqueRecent
        };

    } catch (error) {
        console.error('Error fetching chain data:', error);
        return { transactions: [], tokens: [], nfts: [], sent: [], received: [], totalCount: 0, raw: [] };
    }
}
