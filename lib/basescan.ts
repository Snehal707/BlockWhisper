
interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

interface BasescanResponse {
  status: string;
  message: string;
  result: Transaction[];
}

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;
const BASESCAN_BASE_URL = 'https://api.basescan.org/api';

export async function getAccountTransactions(address: string): Promise<Transaction[]> {
  if (!BASESCAN_API_KEY) {
    console.warn('BASESCAN_API_KEY is not set. Returning mock data.');
    return []; // Or mock data if preferred for dev
  }

  // Calculate timestamp for 24h ago
  const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  // We can't query by time directly on free tier easily without block numbers, 
  // but we can query last N txs and filter.
  // Or just get last 50 and filter by timestamp.

  const params = new URLSearchParams({
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '50', // Get last 50 transactions
    sort: 'desc',
    apikey: BASESCAN_API_KEY,
  });

  try {
    const response = await fetch(`${BASESCAN_BASE_URL}?${params.toString()}`);
    const data: BasescanResponse = await response.json();

    if (data.status !== '1') {
      console.error('Basescan API Error:', data.message);
      return [];
    }

    // Filter for last 24h
    // Note: If user has no txs in last 24h, this returns empty. 
    // We might want to look further back if it's empty, but "fortune based on previous day" implies strict 24h or just "recent activity"

    return data.result.filter(tx => parseInt(tx.timeStamp) >= oneDayAgo);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}

export async function getTokenTransactions(address: string): Promise<Transaction[]> {
  if (!BASESCAN_API_KEY) return [];

  const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  const params = new URLSearchParams({
    module: 'account',
    action: 'tokentx',
    address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '100', // Limit to 100
    sort: 'desc',
    apikey: BASESCAN_API_KEY,
  });

  try {
    const response = await fetch(`${BASESCAN_BASE_URL}?${params.toString()}`);
    const data: BasescanResponse = await response.json();

    if (data.status !== '1') return [];

    return data.result.filter(tx => parseInt(tx.timeStamp) >= oneDayAgo);
  } catch (error) {
    console.error('Failed to fetch token txs:', error);
    return [];
  }
}

export async function getNFTTransactions(address: string): Promise<Transaction[]> {
  if (!BASESCAN_API_KEY) return [];

  const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  const params = new URLSearchParams({
    module: 'account',
    action: 'tokennfttx',
    address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '100',
    sort: 'desc',
    apikey: BASESCAN_API_KEY,
  });

  try {
    const response = await fetch(`${BASESCAN_BASE_URL}?${params.toString()}`);
    const data: BasescanResponse = await response.json();

    if (data.status !== '1') return [];

    return data.result.filter(tx => parseInt(tx.timeStamp) >= oneDayAgo);
  } catch (error) {
    console.error('Failed to fetch NFT txs:', error);
    return [];
  }
}
