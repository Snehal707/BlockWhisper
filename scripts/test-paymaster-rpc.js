import fetch from 'node-fetch';

const url = "https://api.developer.coinbase.com/rpc/v1/base/BlRmgDKqxBW3ifvGP0eR0HQXQnqDauZL";

const payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "pm_getPaymasterStubData",
    "params": [
        {
            "sender": "0xF7DCa789B08Ed2F7995D9bC22c500A8CA715D0A8",
            "nonce": "0x192a01d5c9a0000000000000000",
            "initCode": "0x",
            "callData": "0xb61d27f6000000000000000000000000bc7250022a2531569f013a86de3f944f2e46ab530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
            "callGasLimit": "0x0",
            "verificationGasLimit": "0x0",
            "preVerificationGas": "0x0",
            "maxFeePerGas": "0x0",
            "maxPriorityFeePerGas": "0x0",
            "paymasterAndData": "0x",
            "signature": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c00000000000000000000000000000000000000000000000000000000000000"
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
        "0x2105",
        {}
    ]
};

async function run() {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
