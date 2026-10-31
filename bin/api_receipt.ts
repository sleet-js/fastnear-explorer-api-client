#!/usr/bin/env bun
// ========================================
// API_RECEIPT
// runnable bin for POST /v0/receipt — one receipt and its transaction.
//
// argv:
//   bun bin/api_receipt.ts <receipt_id> [--json]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_receipt.ts 96F2anuMy9WXVgRvpkh9ALbtRqPMomcEYxzuaCryXEjW
// ========================================

import { api_receipt } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--json", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const receipt_id = positional[0];
if (receipt_id === undefined) {
  console.error("usage: bun bin/api_receipt.ts <receipt_id> [--json]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const response = await api_receipt({
  receipt_id,
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
if (seen.has("--json")) {
  console.log(JSON.stringify(response, null, 2));
} else {
  const receipt = response.receipt;
  if (receipt === null) {
    console.log("RECEIPT", receipt_id, "not found");
  } else {
    console.log("RECEIPT", receipt.receipt_id);
    console.log("  type        ", receipt.receipt_type);
    console.log("  predecessor ", receipt.predecessor_id);
    console.log("  receiver    ", receipt.receiver_id);
    console.log("  block       ", receipt.block_height);
    console.log("  tx          ", receipt.transaction_hash);
    console.log("  success     ", receipt.is_success);
  }
  if (response.transaction !== null) {
    console.log("  tx signer   ", response.transaction.transaction.signer_id);
    console.log("  tx actions  ", response.transaction.transaction.actions.length);
  }
}
// ========================================
// copyright 2026 by sleet.near
