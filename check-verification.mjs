import fetch from 'node-fetch';

const BASESCAN_API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const GUID = 'c3x3mldybestwhaa8gssapsku5yuzljumwe5mgevcu9wqiulmj';

async function checkStatus() {
    const url = `https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=checkverifystatus&guid=${GUID}&apikey=${BASESCAN_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log('Verification Status:', data);

    if (data.status === '1' && data.message === 'OK') {
        console.log('✅ VERIFICATION SUCCESS!');
        console.log('Result:', data.result);
    } else if (data.status === '0' && data.result.includes('Pending')) {
        console.log('⏳ Still pending...');
    } else {
        console.log('❌ Verification failed or error');
        console.log('Result:', data.result);
    }
}

checkStatus();
