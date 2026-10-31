#!/usr/bin/env bun
// ========================================
// API_ACCOUNT_FULL
// runnable bin for GET /v1/account/{id}/full — the account overview.
//
// this is the one that backs the account panel: balance, storage,
// tokens, nft contracts and staking pools in one call.
//
// argv:
//   bun bin/api_account_full.ts <account_id> [--json]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_account_full.ts near
//   bun bin/api_account_full.ts sleet.near --json
// ========================================

import { api_account_full, format_near } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--json", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const account_id = positional[0];
if (account_id === undefined) {
  console.error("usage: bun bin/api_account_full.ts <account_id> [--json]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const account = await api_account_full({
  account_id,
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
if (account === null) {
  console.log("ACCOUNT", account_id, "not found");
  process.exit(0);
}

if (seen.has("--json")) {
  console.log(JSON.stringify(account, null, 2));
} else {
  console.log("ACCOUNT", account.account_id);
  if (account.state !== null) {
    console.log("  balance    ", format_near(account.state.balance));
    console.log("  locked     ", format_near(account.state.locked));
    console.log("  storage    ", `${account.state.storage_bytes} bytes`);
  }
  console.log("  tokens     ", account.tokens.length);
  for (const token of account.tokens) {
    console.log(`    ${token.contract_id}  ${token.balance}`);
  }
  console.log("  nfts       ", account.nfts.length);
  for (const nft of account.nfts) {
    console.log(`    ${nft.contract_id}`);
  }
  console.log("  pools      ", account.pools.length);
  for (const pool of account.pools) {
    console.log(`    ${pool.pool_id}`);
  }
}
// ========================================
// copyright 2026 by sleet.near
