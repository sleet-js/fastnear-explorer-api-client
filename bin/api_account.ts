#!/usr/bin/env bun
// ========================================
// API_ACCOUNT
// runnable bin for POST /v0/account — one account's transaction history.
//
// the history pages with `resume_token` — pass the token from the
// previous run to get the next page.
//
// argv:
//   bun bin/api_account.ts <account_id> [--limit n] [--signer] [--receiver]
//       [--success] [--failed] [--desc] [--resume token]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_account.ts sleet.near --limit 5
//   bun bin/api_account.ts sleet.near --limit 5 --desc
//   bun bin/api_account.ts sleet.near --signer --success
// ========================================

import { api_account } from "../src/index";
import { check_limit } from "./fun/check_limit";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = [
  "--signer",
  "--receiver",
  "--success",
  "--failed",
  "--desc",
  "--testnet",
];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const account_id = positional[0];
if (account_id === undefined) {
  console.error("usage: bun bin/api_account.ts <account_id> [--limit n] [--signer] [--desc]");
  process.exit(1);
}

const network = resolve_network(flags, seen);
const limit = check_limit(flags.get("--limit"), { min: 1, max: 100 });

const response = await api_account({
  account_id,
  limit,
  is_real_signer: seen.has("--signer") ? true : undefined,
  is_receiver: seen.has("--receiver") ? true : undefined,
  is_success: seen.has("--failed") ? false : seen.has("--success") ? true : undefined,
  desc: seen.has("--desc"),
  resume_token: flags.get("--resume"),
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
console.log(
  "ACCOUNT",
  account_id,
  `${response.account_txs.length} tx(s) of ${response.txs_count}`,
);
for (const tx of response.account_txs) {
  console.log(
    `  ${tx.transaction_hash}  ${tx.tx_block_height}  ` +
      `${tx.is_success ? "ok" : "failed"}  ` +
      `signer=${tx.is_real_signer} receiver=${tx.is_real_receiver}`,
  );
}
if (response.resume_token !== undefined) {
  console.log("RESUME TOKEN", response.resume_token);
}
// ========================================
// copyright 2026 by sleet.near
