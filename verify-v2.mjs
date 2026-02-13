
const API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const ADDRESS = '0x8e3a007a1e0b8881a1b85a745054832705188583';
const ETHERSCAN_V2_URL = 'https://api.etherscan.io/v2/api';
const CHAIN_ID = '8453'; // Base

async function verifyV2() {
    console.log('Verifying Etherscan V2 for Base (Chain ID 8453)...');
    const params = new URLSearchParams({
        chainid: CHAIN_ID,
        module: 'account',
        action: 'txlist',
        address: ADDRESS,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '1',
        sort: 'desc',
        apikey: API_KEY
    });

    try {
        const url = `${ETHERSCAN_V2_URL}?${params}`;
        console.log(`Fetching: ${url}`);
        const res = await fetch(url);
        const data = await res.json();

        console.log('Status:', data.status);
        if (data.status === '1') {
            const tx = data.result[0];
            console.log('Success! Most recent TX:', tx.hash);
            console.log('Block Number:', tx.blockNumber);
            // Verify it looks like a Base block (Base blocks are > 10M usually, Mainnet > 19M. Hard to tell just by number, but successful fetch confirms chain access)
        } else {
            console.log('Error:', data.message, data.result);
        }
    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}

verifyV2();
