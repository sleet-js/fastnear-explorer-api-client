#!/usr/bin/env bun
// ========================================
// API_BLOCK
// runnable bin for POST /v0/block — one block, by height or hash.
//
// argv:
//   bun bin/api_block.ts <block_id> [--transactions] [--receipts]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_block.ts 222453064
//   bun bin/api_block.ts 222453064 --transactions --receipts
//   bun bin/api_block.ts 96pvkznpNepxKQJqtuX2mwYFneQuMc3REq2L85qko2Td
// ========================================

import { api_block } from "../src/index.js";
import { resolve_network } from "./fun/resolve_network.js";
import { split_argv } from "./fun/split_argv.js";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--transactions", "--receipts", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (process.argv.length <= 2) {
  console.error(
    "usage: bun bin/api_block.ts <block_id> [--transactions] [--receipts] [--network mainnet|testnet]",
  );
  process.exit(1);
}

const block_id_raw = positional[0];
if (block_id_raw === undefined) {
  console.error("api_block needs a block height or hash");
  process.exit(1);
}

const network = resolve_network(flags, seen);
const block_id = /^\d+$/.test(block_id_raw) ? Number(block_id_raw) : block_id_raw;

const response = await api_block({
  block_id,
  with_transactions: seen.has("--transactions"),
  with_receipts: seen.has("--receipts"),
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
const block = response.block;
console.log("BLOCK", block.block_height, block.block_hash);
console.log("  author        ", block.author_id);
console.log("  timestamp     ", block.block_timestamp);
console.log("  protocol      ", block.protocol_version);
console.log("  chunks        ", block.chunks_included);
console.log("  gas burnt     ", block.gas_burnt);
console.log("  tokens burnt  ", block.tokens_burnt);
console.log("  total supply  ", block.total_supply);
console.log("  transactions  ", response.block_txs.length);
console.log("  receipts      ", response.block_receipts.length);

for (const tx of response.block_txs) {
  console.log(
    `    ${tx.transaction_hash}  ${tx.signer_id} -> ${tx.receiver_id}  ` +
      `${tx.is_success ? "ok" : "failed"}  ${tx.gas_burnt} gas`,
  );
}

for (const receipt of response.block_receipts) {
  console.log(
    `    receipt ${receipt.receipt_id}  ${receipt.predecessor_id} -> ` +
      `${receipt.receiver_id}  ${receipt.receipt_type}  ` +
      `${receipt.is_success ? "ok" : "failed"}`,
  );
}
// ========================================
// copyright 2026 by sleet.near
