
const API_KEY = 'D2LQ_R04W5WhsowRyJeRj'; // From .env.local
const ADDRESS = '0xb96F...C5bb'; // User wallet from screenshot (partial, using contract for test)
// Using contract address for reliable test data
const TEST_ADDRESS = '0x8e3a007a1e0b8881a1b85a745054832705188583';
const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${API_KEY}`;

async function testAlchemy() {
    console.log('Testing Alchemy Asset Transfers for Base...');

    const payload = {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
            {
                fromBlock: "0x0",
                toBlock: "latest",
                fromAddress: TEST_ADDRESS,
                category: ["external", "erc20", "erc721", "erc1155"],
                withMetadata: false,
                excludeZeroValue: false,
                maxCount: "0x20" // 32 items
            }
        ]
    };

    try {
        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.result) {
            console.log('Success!');
            console.log('Transfers found:', data.result.transfers.length);
            if (data.result.transfers.length > 0) {
                console.log('Sample transfer:', data.result.transfers[0]);
            }
        } else {
            console.log('Error:', data);
        }

        // Also test reception
        const payloadReceive = { ...payload };
        payloadReceive.params[0].fromAddress = undefined;
        payloadReceive.params[0].toAddress = TEST_ADDRESS;

        const res2 = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadReceive)
        });
        const data2 = await res2.json();
        console.log('Incoming Transfers found:', data2.result?.transfers?.length);

    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}

testAlchemy();
