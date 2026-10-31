#!/usr/bin/env bun
// ========================================
// API_TOKEN_HOLDERS
// runnable bin for the top holders of a fungible token.
//
// argv:
//   bun bin/api_token_holders.ts <token_id> [--top n]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_token_holders.ts wrap.near
//   bun bin/api_token_holders.ts wrap.near --top 10
// ========================================

import { api_token_holders, format_token_amount } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const token_id = positional[0];
if (token_id === undefined) {
  console.error("usage: bun bin/api_token_holders.ts <token_id> [--top n]");
  process.exit(1);
}

const network = resolve_network(flags, seen);
const top_raw = flags.get("--top");
const top = top_raw !== undefined ? Number(top_raw) : undefined;

const response = await api_token_holders({
  token_id,
  config: { network },
});

// --- summary -------------------------------------------------------
console.log("TOP HOLDERS", response.token_id, `${response.accounts.length} account(s)`);
for (const account of response.accounts) {
  console.log(`  ${account.account_id}  ${account.balance}`);
  if (top !== undefined) break;
}
// ========================================
// copyright 2026 by sleet.near
