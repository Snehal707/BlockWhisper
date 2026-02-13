import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read pre-compiled artifact from hardhat
const artifactPath = join(__dirname, '../artifacts/contracts/BlockWhisperFortune.sol/BlockWhisperFortune.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

const abi = artifact.abi;
const bytecode = artifact.bytecode;

console.log('🚀 Deploying to Base Mainnet...');

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error('PRIVATE_KEY missing');

const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);

const walletClient = createWalletClient({ account, chain: base, transport: http() });
const publicClient = createPublicClient({ chain: base, transport: http() });

console.log(`📍 From: ${account.address}`);

const hash = await walletClient.deployContract({ abi, bytecode, account });

console.log(`⏳ TX Hash: ${hash}`);
const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log(`\n✅ DEPLOYED: ${receipt.contractAddress}`);
console.log(`🔗 https://basescan.org/address/${receipt.contractAddress}`);

// Update .env.local
const envPath = join(__dirname, '../.env.local');
let envContent = readFileSync(envPath, 'utf8');
envContent = envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')
    ? envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`)
    : envContent + `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
writeFileSync(envPath, envContent);
console.log('✅ Saved to .env.local');
