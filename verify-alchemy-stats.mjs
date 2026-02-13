
const API_KEY = 'D2LQ_R04W5WhsowRyJeRj';
const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${API_KEY}`;
// Base Bridge Address (Known active)
const CONTRACT_ADDRESS = '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e';

async function getTransfers(params) {
    const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "alchemy_getAssetTransfers",
            params: [params]
        })
    });
    return response.json();
}

async function verifyStats() {
    console.log('Verifying Alchemy Stats Logic...');

    // 1. Get Incoming Transfers (to check for NFT mints)
    console.log('Fetching Incoming Transfers...');
    const incoming = await getTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        toAddress: CONTRACT_ADDRESS, // Fetching mocked "user" activity (using contract as proxy for a user who interacts)
        category: ["external", "erc20", "erc721", "erc1155"],
        withMetadata: true,
        maxCount: "0x20"
    });

    console.log('Incoming Count:', incoming.result?.transfers?.length);
    if (incoming.result?.transfers?.length > 0) {
        console.log('Sample Incoming:', incoming.result.transfers[0]);
    }

    // 2. Get Outgoing
    console.log('Fetching Outgoing Transfers...');
    const outgoing = await getTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: CONTRACT_ADDRESS,
        category: ["external", "erc20", "erc721", "erc1155"],
        withMetadata: true,
        maxCount: "0x20"
    });

    console.log('Outgoing Count:', outgoing.result?.transfers?.length);
    if (outgoing.result?.transfers?.length > 0) {
        console.log('Sample Outgoing:', outgoing.result.transfers[0]);
    }
}

verifyStats();
