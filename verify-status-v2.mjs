
import fetch from 'node-fetch';

const BASESCAN_API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const GUID = 'cixrqjgihcyhmmvas5yyeyqbxvnymm5r5eexuvavkyv5ks9vad';
const CONTRACT_ADDRESS = '0x8e3a007a1e0b8881a1b85a745054832705188583';

async function checkStatus() {
    console.log('Checking verification status (V2)...');

    // Etherscan V2 URL needs chainid in query string
    const url = `https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=checkverifystatus&guid=${GUID}&apikey=${BASESCAN_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log('Status Response:', data);

        if (data.status === '1' && data.message === 'OK') {
            console.log('✅ Verification SUCCESS!');
            console.log('Contract:', CONTRACT_ADDRESS);
            console.log('Message:', data.result);
        } else if (data.status === '0' && data.result === 'Pending in queue') {
            console.log('⏳ Verification PENDING...');
            console.log('Message:', data.result);
        } else {
            console.log('❌ Verification FAILED or ERROR');
            console.log('Message:', data.result);
            console.log('Full Output:', data);
        }

    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

// Check if node-fetch is available, otherwise use global fetch (Node 18+)
if (typeof fetch === 'undefined') {
    import('node-fetch').then(m => {
        global.fetch = m.default;
        checkStatus();
    }).catch(e => {
        console.log('Using global fetch...');
        checkStatus();
    });
} else {
    checkStatus();
}
