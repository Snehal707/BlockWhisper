const solc = require('solc');
const fs = require('fs');
const path = require('path');
const util = require('util');

const contractPath = path.join(__dirname, 'contracts/BlockWhisperFortune.sol');
const source = fs.readFileSync(contractPath, 'utf8');

console.log('📦 Compiling...');

const input = {
    language: 'Solidity',
    sources: {
        'BlockWhisperFortune.sol': { content: source },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    console.log('\n❌ Errors found:\n');
    let hasError = false;
    output.errors.forEach((err) => {
        if (err.severity === 'error') hasError = true;
        console.log('---');
        console.log(util.inspect(err, { depth: null, colors: true }));
    });

    if (hasError) console.log('\nCompilation FAILED');
    else console.log('\nCompilation SUCCESS (with warnings)');
} else {
    console.log('✅ Compilation SUCCESS via solc directly!');
}
