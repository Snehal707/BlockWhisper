try {
    const ethers = require('ethers');
    console.log('✅ ethers:', ethers.version || 'loaded');
} catch (e) {
    console.error('❌ ethers failed:', e.message);
}

try {
    const solc = require('solc');
    console.log('✅ solc:', solc.version ? solc.version() : 'loaded');
} catch (e) {
    console.error('❌ solc failed:', e.message);
}
