#!/usr/bin/env bun
// ========================================
// API_TRANSACTIONS
// runnable bin for POST /v0/transactions — full transactions by hash.
//
// the api takes at most 20 hashes per call.
//
// argv:
//   bun bin/api_transactions.ts <hash> [<hash> ...] [--json]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_transactions.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
//   bun bin/api_transactions.ts HASH1 HASH2 --json
// ========================================

import { api_transactions } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--json", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (positional.length === 0) {
  console.error("usage: bun bin/api_transactions.ts <hash> [<hash> ...] [--json]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const response = await api_transactions({
  tx_hashes: positional,
  config: { network },
  quiet: true,
});

// --- summary -------------------------------------------------------
if (seen.has("--json")) {
  console.log(JSON.stringify(response, null, 2));
} else {
  console.log("TRANSACTIONS", `${response.transactions.length} of ${positional.length} found`);
  for (const tx of response.transactions) {
    console.log(`  ${tx.transaction.hash}`);
    console.log(`    signer    ${tx.transaction.signer_id}`);
    console.log(`    receiver  ${tx.transaction.receiver_id}`);
    console.log(`    actions   ${tx.transaction.actions.length}`);
    console.log(`    receipts  ${tx.receipts.length}`);
    console.log(
      `    block     ${tx.execution_outcome.block_height}  ` +
        `gas ${tx.execution_outcome.outcome.gas_burnt}`,
    );
  }
}
// ========================================
// copyright 2026 by sleet.near
