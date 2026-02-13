const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function main() {
    console.log('🚀 Starting deployment via Ethers.js...');

    // 1. Compile Contract
    const contractPath = path.join(__dirname, '../contracts/BlockWhisperFortune.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'BlockWhisperFortune.sol': { content: source },
        },
        settings: {
            optimizer: { enabled: true, runs: 200 },
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    console.log('📦 Compiling...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        let hasError = false;
        output.errors.forEach((err) => {
            if (err.severity === 'error') hasError = true;
            console.log(err.formattedMessage || err);
        });
        if (hasError) throw new Error('❌ Compilation failed');
    }
    console.log('✅ Compiled successfully');

    const contract = output.contracts['BlockWhisperFortune.sol']['BlockWhisperFortune'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    // 2. Setup Provider & Wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error('PRIVATE_KEY missing');

    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`📍 Deploying from: ${wallet.address}`);

    // 3. Deploy
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contractInstance = await factory.deploy();

    console.log('⏳ Deployment transaction sent...');
    await contractInstance.waitForDeployment();

    const address = await contractInstance.getAddress();
    console.log(`\n✅ CONTRACT DEPLOYED at: ${address}`);
    console.log(`🔗 Basescan: https://basescan.org/address/${address}`);

    // 4. Update .env.local
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
    } else {
        envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local updated');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
