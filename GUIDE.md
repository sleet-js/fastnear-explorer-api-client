# FastNear Explorer API Client - Usage Guide

A reusable TypeScript client for the [FastNear Explorer API](https://github.com/fastnear/explorer).

## Installation

```bash
npm install @sleet-js/fastnear-explorer-api-client
# or
bun add @sleet-js/fastnear-explorer-api-client
```

## Quick Start

```typescript
import { getBlocks, getAccount, getAccountFull } from "@sleet-js/fastnear-explorer-api-client";

// Fetch recent blocks (mainnet by default)
const blocks = await getBlocks({ limit: 10 });
console.log(blocks.blocks);

// Fetch account transactions
const account = await getAccount("example.near");
console.log(account.account_txs);

// Fetch full account info (balance, tokens, NFTs, pools)
const fullAccount = await getAccountFull("example.near");
console.log(fullAccount?.state?.balance);
```

## Networks

The client supports both **mainnet** and **testnet**:

### Using Testnet

```typescript
import { getBlocks, getAccountFull, ENDPOINTS } from "@sleet-js/fastnear-explorer-api-client";

// Option 1: Pass config with testnet URL
const blocks = await getBlocks({ limit: 10 }, { baseUrl: ENDPOINTS.testnet.api });

// Option 2: Pass networkId to v1 API
const account = await getAccountFull("example.testnet", "testnet");
```

### Network Endpoints

| Network | Explorer API | FastNear API |
|---------|-------------|--------------|
| mainnet | `https://tx.main.fastnear.com` | `https://api.fastnear.com` |
| testnet | `https://tx.test.fastnear.com` | `https://test.api.fastnear.com` |

## API Reference

### v0 Explorer API

#### `getBlocks(params?, config?)`
Fetch recent blocks from the blockchain.

```typescript
import { getBlocks } from "@sleet-js/fastnear-explorer-api-client";

const blocks = await getBlocks({
  limit: 20,
  desc: true,
  from_block_height: 100000000,
});
```

#### `getBlock(blockId, opts?, config?)`
Fetch details for a specific block by hash or height.

```typescript
import { getBlock } from "@sleet-js/fastnear-explorer-api-client";

const block = await getBlock(100000000, { with_transactions: true });
console.log(block.block);
console.log(block.block_txs);
```

#### `getTransactions(txHashes, config?)`
Fetch transaction details by hashes.

```typescript
import { getTransactions } from "@sleet-js/fastnear-explorer-api-client";

const txs = await getTransactions([
  "HASH1",
  "HASH2",
]);
console.log(txs.transactions);
```

#### `getAccount(accountId, filters?, config?)`
Fetch account transaction history with optional filters.

```typescript
import { getAccount } from "@sleet-js/fastnear-explorer-api-client";

const account = await getAccount("example.near", {
  limit: 50,
  is_signer: true,
  is_success: true,
  desc: true,
});
console.log(account.account_txs);
console.log(account.resume_token); // for pagination
```

### v1 FastNear API

#### `getAccountFull(accountId, networkId?, signal?)`
Fetch complete account information including state, FT tokens, NFTs, and staking pools.

```typescript
import { getAccountFull } from "@sleet-js/fastnear-explorer-api-client";

const full = await getAccountFull("example.near");
if (full) {
  console.log("Balance:", full.state?.balance);
  console.log("FT Tokens:", full.tokens);
  console.log("NFTs:", full.nfts);
  console.log("Pools:", full.pools);
}
```

## Configuration

### Custom API Base URL

```typescript
import { getBlocks } from "@sleet-js/fastnear-explorer-api-client";

const blocks = await getBlocks({ limit: 10 }, {
  baseUrl: "https://custom.api.example.com"
});
```

### Using Constants

```typescript
import { getBlocks, ENDPOINTS } from "@sleet-js/fastnear-explorer-api-client";

// Testnet
const testnetBlocks = await getBlocks({ limit: 10 }, {
  baseUrl: ENDPOINTS.testnet.api
});

// Mainnet (default)
const mainnetBlocks = await getBlocks({ limit: 10 }, {
  baseUrl: ENDPOINTS.mainnet.api
});
```

## Types

All response types are exported for TypeScript users:

```typescript
import type {
  BlocksResponse,
  BlockDetailResponse,
  TransactionsResponse,
  AccountResponse,
  AccountFullResponse,
  BlockHeader,
  BlockTx,
  TransactionDetail,
  AccountTx,
} from "@sleet-js/fastnear-explorer-api-client";
```

## Error Handling

```typescript
import { getAccountFull } from "@sleet-js/fastnear-explorer-api-client";

try {
  const account = await getAccountFull("nonexistent.near");
  if (account === null) {
    console.log("Account not found (404)");
  }
} catch (error) {
  console.error("API error:", error.message);
}
```

## AbortSignal Support

The `getAccountFull` function supports abort signals for canceling requests:

```typescript
const controller = new AbortController();

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const account = await getAccountFull("example.near", "mainnet", controller.signal);
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was cancelled");
  }
}
```

## Pagination

For account transactions, use the `resume_token` for pagination:

```typescript
import { getAccount } from "@sleet-js/fastnear-explorer-api-client";

let resumeToken: string | undefined;
const allTxs = [];

do {
  const response = await getAccount("example.near", {
    limit: 100,
    resume_token: resumeToken,
  });
  
  allTxs.push(...response.account_txs);
  resumeToken = response.resume_token;
} while (resumeToken);
```

## License

MIT
