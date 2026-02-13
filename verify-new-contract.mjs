import fs from 'fs';
import fetch from 'node-fetch';

const BASESCAN_API_KEY = 'JQN76SS2D8887MRK9EDW97EXEQCQVZUVNE';
const CONTRACT_ADDRESS = '0xbc7250022a2531569f013a86de3f944f2e46ab53'; // NEW ADDRESS with viaIR
const CONTRACT_NAME = 'BlockWhisperFortune';

async function verify() {
    console.log('Reading source code...');
    const sourceCode = fs.readFileSync('./contracts/BlockWhisperFortune.sol', 'utf8');

    // EXACT Standard JSON Input matching deployment
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
            viaIR: true,
            evmVersion: 'shanghai'
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
    params.append('contractname', 'BlockWhisperFortune.sol:BlockWhisperFortune');
    params.append('compilerversion', 'v0.8.24+commit.e11b9ed9');

    console.log('Submitting verification (viaIR enabled)...');
    const res = await fetch('https://api.etherscan.io/v2/api?chainid=8453', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const data = await res.json();
    console.log('Response:', data);

    if (data.status === '1') {
        console.log('✅ Verification submitted! GUID:', data.result);
        console.log('🔗 Check status:', `https://basescan.org/address/${CONTRACT_ADDRESS}#code`);
    } else {
        console.error('❌ Submission failed:', data.message, data.result);
    }
}

verify();
