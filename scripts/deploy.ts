
import { ethers } from "hardhat";

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    console.log("Deploying BlockWhisperFortune...");

    const Fortune = await ethers.getContractFactory("BlockWhisperFortune");
    const fortune = await Fortune.deploy();

    await fortune.waitForDeployment();

    console.log(
        `BlockWhisperFortune deployed to ${await fortune.getAddress()}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
