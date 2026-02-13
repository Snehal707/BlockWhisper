import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Fix solc import for Node 22 ESM
const require = createRequire(import.meta.url);
const solc = require('solc');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractPath = path.join(__dirname, '../contracts/BlockWhisperFortune.sol');
const source = fs.readFileSync(contractPath, 'utf8');

console.log('📦 Compiling contract...');
console.log('🔧 Solc version:', solc.version());

const input = {
    language: 'Solidity',
    sources: {
        'BlockWhisperFortune.sol': { content: source },
    },
    settings: {
        optimizer: { enabled: true, runs: 200 },
        viaIR: true,
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode', 'metadata'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach((err) => {
        console.log(err.formattedMessage || err);
    });
    if (output.errors.some((err) => err.severity === 'error')) {
        throw new Error('❌ Compilation failed');
    }
}

const contract = output.contracts['BlockWhisperFortune.sol']['BlockWhisperFortune'];
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

// Extract and log compiler metadata
const metadata = JSON.parse(contract.metadata);
console.log('✅ Contract compiled successfully');
console.log('📋 Compiler Details:');
console.log('   Version:', metadata.compiler.version);
console.log('   Optimizer:', metadata.settings.optimizer.enabled, '- Runs:', metadata.settings.optimizer.runs);
console.log('   viaIR:', metadata.settings.viaIR);
console.log('   EVM Version:', metadata.settings.evmVersion || 'default');
console.log('   Bytecode length:', bytecode.length, 'chars');

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error('❌ PRIVATE_KEY not found in .env.local');

const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);

const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
});

const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

console.log(`\n🚀 Deploying to Base Mainnet...`);
console.log(`📍 From: ${account.address}`);

const hash = await walletClient.deployContract({
    abi,
    bytecode: `0x${bytecode}`,
    account,
});

console.log(`⏳ TX Hash: ${hash}`);
console.log('⏳ Waiting for confirmation...');

const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log(`\n✅ CONTRACT DEPLOYED!`);
console.log(`📍 Address: ${receipt.contractAddress}`);
console.log(`🔗 Basescan: https://basescan.org/address/${receipt.contractAddress}`);

// Update .env.local
const envPath = path.join(__dirname, '../.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`);
} else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Saved to .env.local');
