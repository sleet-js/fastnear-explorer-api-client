# FastNear Explorer API Client - Bin Scripts

Test scripts for the FastNear Explorer API client. Run with `bun run bin/<script>.ts`.

## Available Scripts

### Account Transactions

| Script | Description | Command |
|--------|-------------|---------|
| `get-account-testnet.ts` | Get transactions for `sleet.testnet` | `bun run bin/get-account-testnet.ts` |
| `get-account-mainnet.ts` | Get transactions for `sleet.near` | `bun run bin/get-account-mainnet.ts` |

### Transaction Details

| Script | Description | Command |
|--------|-------------|---------|
| `get-tx-testnet.ts` | Get specific transaction (testnet) | `bun run bin/get-tx-testnet.ts` |
| `get-tx-mainnet.ts` | Get specific transaction (mainnet) | `bun run bin/get-tx-mainnet.ts` |

## Examples

### Get Account Transactions (Testnet)
```bash
bun run bin/get-account-testnet.ts
```

### Get Account Transactions (Mainnet)
```bash
bun run bin/get-account-mainnet.ts
```

### Get Transaction Details (Testnet)
```bash
bun run bin/get-tx-testnet.ts
```

### Get Transaction Details (Mainnet)
```bash
bun run bin/get-tx-mainnet.ts
```

## Customizing

Edit the script files to change:
- Account IDs
- Transaction hashes
- Query parameters (limit, filters, etc.)
- Network configuration
