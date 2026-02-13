
const API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const ADDRESS = '0x8e3a007a1e0b8881a1b85a745054832705188583';
const ETHERSCAN_V2_URL = 'https://api.etherscan.io/v2/api';
const BASE_CHAIN_ID = '8453';

async function verifySequential() {
    console.log('Verifying Sequential V2 Flow...');

    const baseParams = {
        chainid: BASE_CHAIN_ID,
        apikey: API_KEY,
        address: ADDRESS,
        page: '1',
        offset: '5',
        sort: 'desc',
    };

    const fetchOne = async (action) => {
        const url = `${ETHERSCAN_V2_URL}?${new URLSearchParams({ ...baseParams, module: 'account', action, startblock: '0', endblock: '99999999' })}`;
        console.log(`Fetching ${action}...`);
        const t0 = performance.now();
        const res = await fetch(url);
        const data = await res.json();
        console.log(`  Status: ${data.status}, Message: ${data.message}, Time: ${Math.round(performance.now() - t0)}ms`);
        if (data.status === '0') console.log('  Result:', data.result);
        return data;
    };

    await fetchOne('txlist');
    await fetchOne('tokentx');
    await fetchOne('tokennfttx');
    console.log('Done.');
}

verifySequential();
