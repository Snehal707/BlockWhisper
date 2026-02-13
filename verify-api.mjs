
import fs from 'fs';
import fetch from 'node-fetch';

const BASESCAN_API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const CONTRACT_ADDRESS = '0x8e3a007a1e0b8881a1b85a745054832705188583';
const CONTRACT_NAME = 'BlockWhisperFortune';
const COMPILER_VERSION = 'v0.8.24+commit.e11b9ed9'; // Standard v0.8.24

async function verify() {
    console.log('Reading source code...');
    const sourceCode = fs.readFileSync('./contracts/BlockWhisperFortune.sol', 'utf8');

    const standardJsonInput = {
        language: 'Solidity',
        sources: {
            'BlockWhisperFortune.sol': {
                content: sourceCode
            }
        },
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            evmVersion: 'paris' // explicit paris to avoid stack too deep errors seen with shanghai
        }
    };

    const params = new URLSearchParams();
    params.append('chainid', '8453');
    params.append('apikey', BASESCAN_API_KEY);
    params.append('module', 'contract');
    params.append('action', 'verifysourcecode');
    params.append('contractaddress', CONTRACT_ADDRESS);
    params.append('sourceCode', JSON.stringify(standardJsonInput));
    params.append('codeformat', 'solidity-standard-json-input');
    params.append('contractname', `${CONTRACT_NAME}.sol:${CONTRACT_NAME}`); // Format: File.sol:Contract
    params.append('compilerversion', 'v0.8.24+commit.e11b9ed9');

    console.log('Submitting verification request (Standard JSON)...');
    const res = await fetch('https://api.etherscan.io/v2/api?chainid=8453', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const data = await res.json();
    console.log('Response:', data);

    if (data.status === '1') {
        console.log('Verification submitted! GUID:', data.result);
        console.log('Check status at:', `https://basescan.org/verifyos?a=${CONTRACT_ADDRESS}`);

        // Optional: Poll for status
        checkStatus(data.result);
    } else {
        console.error('Submission failed:', data.message, data.result);
    }
}

async function checkStatus(guid) {
    console.log('Checking status in 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));

    const res = await fetch(`https://api.basescan.org/api?module=contract&action=checkverifystatus&guid=${guid}&apikey=${BASESCAN_API_KEY}`);
    const data = await res.json();
    console.log('Verification Status:', data.result);
}

// Check if node-fetch is available, otherwise use global fetch (Node 18+)
if (typeof fetch === 'undefined') {
    import('node-fetch').then(m => {
        global.fetch = m.default;
        verify();
    }).catch(e => {
        console.log('Using global fetch...');
        verify();
    });
} else {
    verify();
}
