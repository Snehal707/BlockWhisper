const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying BlockWhisperFortune to Base Mainnet...");

    const BlockWhisperFortune = await hre.ethers.getContractFactory("BlockWhisperFortune");
    const fortune = await BlockWhisperFortune.deploy();

    await fortune.waitForDeployment();

    const address = await fortune.getAddress();
    console.log(`✅ Contract deployed to: ${address}`);

    // Save contract address to .env.local
    const envPath = path.join(__dirname, "../.env.local");
    let envContent = fs.readFileSync(envPath, "utf8");

    // Update or add CONTRACT_ADDRESS
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
        envContent = envContent.replace(
            /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
            `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
        );
    } else {
        envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Contract address saved to .env.local");

    console.log("\n📋 Deployment Summary:");
    console.log("Network: Base Mainnet");
    console.log(`Contract: ${address}`);
    console.log(`Explorer: https://basescan.org/address/${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
