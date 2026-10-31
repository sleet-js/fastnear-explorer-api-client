#!/usr/bin/env bun
// ========================================
// PARSE_CORPUS
// the corpus bin — pull many transactions and report what the parser
// found across all of them.
//
// this is the bin to reach for when you want to know which action
// types and event standards are actually in the wild right now.
//
// argv:
//   bun bin/parse_corpus.ts [--blocks n] [--txs n] [--standards]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/parse_corpus.ts --blocks 10 --txs 50
//   bun bin/parse_corpus.ts --standards
// ========================================

import {
  api_block,
  api_blocks,
  api_transactions,
  collect_events,
  parse_transaction,
  TRANSACTIONS_BATCH_SIZE,
} from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";
import { throttle } from "./fun/throttle";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--standards", "--testnet"];

// --- argv ----------------------------------------------------------
const { flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const network = resolve_network(flags, seen);
const block_count = Number(flags.get("--blocks") ?? "5");
const tx_limit = Number(flags.get("--txs") ?? "40");

// --- corpus --------------------------------------------------------
const blocks = await api_blocks({
  limit: Math.min(block_count, 100),
  desc: true,
  config: { network },
    quiet: true,
});

const hashes: string[] = [];
for (const block of blocks.blocks) {
  const detail = await api_block({
    block_id: block.block_height,
    with_transactions: true,
    config: { network },
  });
  for (const tx of detail.block_txs) hashes.push(tx.transaction_hash);
  if (hashes.length >= tx_limit) break;
  await throttle(120);
}

const transactions = [];
for (let i = 0; i < hashes.length; i += TRANSACTIONS_BATCH_SIZE) {
  const batch = hashes.slice(i, i + TRANSACTIONS_BATCH_SIZE);
  const response = await api_transactions({
    tx_hashes: batch,
    config: { network },
    quiet: true,
  });
  transactions.push(...response.transactions);
}

// --- report --------------------------------------------------------
const action_types = new Map<string, number>();
const standards = new Map<string, number>();
const events = new Map<string, number>();
const token_types = new Map<string, number>();

let transfers = 0;
let nft_transfers = 0;
let delegated = 0;
let succeeded = 0;
let failed = 0;

for (const tx of transactions) {
  const parsed = parse_transaction(tx);

  for (const action of parsed.actions) {
    action_types.set(action.type, (action_types.get(action.type) ?? 0) + 1);
  }

  for (const collected of collect_events(tx)) {
    const standard = collected.event.standard ?? "(none)";
    standards.set(standard, (standards.get(standard) ?? 0) + 1);
    const name = collected.event.event ?? "(none)";
    events.set(`${standard} ${name}`, (events.get(`${standard} ${name}`) ?? 0) + 1);
  }

  for (const transfer of parsed.transfers) {
    transfers++;
    token_types.set(
      transfer.token_type,
      (token_types.get(transfer.token_type) ?? 0) + 1,
    );
  }
  nft_transfers += parsed.nft_transfers.length;

  if (parsed.is_delegated) delegated++;
  if (parsed.is_success === true) succeeded++;
  if (parsed.is_success === false) failed++;
}

console.log("CORPUS");
console.log(`  transactions   ${transactions.length}`);
console.log(`  transfers      ${transfers}`);
console.log(`  nft transfers  ${nft_transfers}`);
console.log(`  delegated      ${delegated}`);
console.log(`  success        ${succeeded} ok, ${failed} failed`);

console.log("\nACTION TYPES");
for (const [type, count] of [...action_types].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(6)}  ${type}`);
}

console.log("\nTOKEN TYPES");
for (const [type, count] of [...token_types].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(6)}  ${type}`);
}

if (seen.has("--standards")) {
  console.log("\nEVENT STANDARDS");
  for (const [standard, count] of [...standards].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(6)}  ${standard}`);
  }

  console.log("\nEVENTS");
  for (const [name, count] of [...events].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(6)}  ${name}`);
  }
}
// ========================================
// copyright 2026 by sleet.near
