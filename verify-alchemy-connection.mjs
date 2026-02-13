
const API_KEY = 'D2LQ_R04W5WhsowRyJeRj';
const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${API_KEY}`;

async function verifyAlchemy() {
    console.log('Verifying Alchemy Connection...');

    try {
        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "eth_blockNumber",
                params: []
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (data.result) {
            console.log('Current Block (Hex):', data.result);
            console.log('Current Block (Dec):', parseInt(data.result, 16));
        } else {
            console.log('Error:', data);
        }
    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}

verifyAlchemy();
