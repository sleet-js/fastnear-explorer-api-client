#!/usr/bin/env bun
// ========================================
// PARSE_TRANSACTION
// runnable bin for the parser — parse one transaction and print it.
//
// this is the bin to reach for when you want to see what the parser
// makes of a transaction. it prints the same shape an explorer ui
// would render.
//
// argv:
//   bun bin/parse_transaction.ts <hash> [<hash> ...] [--json] [--full]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/parse_transaction.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
//   bun bin/parse_transaction.ts GUbRKHUiwF6yJ56DuWZ9gHT9QHkmEQDr4utmNEVDd4BD --json
// ========================================

import {
  api_transactions,
  format_gas,
  format_near,
  parse_transaction,
  time_ago,
} from "../src/index.js";
import { resolve_network } from "./fun/resolve_network.js";
import { split_argv } from "./fun/split_argv.js";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--json", "--full", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (positional.length === 0) {
  console.error("usage: bun bin/parse_transaction.ts <hash> [<hash> ...] [--json]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const response = await api_transactions({
  tx_hashes: positional,
  config: { network },
  quiet: true,
});

if (response.transactions.length === 0) {
  console.log("PARSED", "no transactions found");
  process.exit(0);
}

// --- summary -------------------------------------------------------
for (const tx of response.transactions) {
  const parsed = parse_transaction(tx);

  if (seen.has("--json")) {
    console.log(JSON.stringify(parsed, null, 2));
    continue;
  }

  console.log("=".repeat(60));
  console.log("HASH        ", parsed.hash);
  console.log("SIGNER      ", parsed.signer_id);
  console.log("RECEIVER    ", parsed.receiver_id);
  if (parsed.relayer_id !== null) {
    console.log("RELAYER     ", parsed.relayer_id, "(relayed)");
  }
  console.log("BLOCK       ", parsed.block_height, `  ${time_ago(parsed.timestamp)}`);
  console.log("GAS         ", format_gas(parsed.gas_burnt));
  console.log(
    "SUCCESS     ",
    parsed.is_success === null
      ? "pending"
      : parsed.is_success
        ? "yes"
        : "no",
  );

  console.log("ACTIONS");
  for (const action of parsed.actions) {
    const parts = [action.type];
    if (action.method_name !== undefined) parts.push(action.method_name);
    if (action.deposit !== undefined && action.deposit !== "0") {
      parts.push(format_near(action.deposit));
    }
    if (action.gas !== undefined) parts.push(format_gas(action.gas));
    if (action.access_key_permission !== undefined) {
      parts.push(`(${action.access_key_permission})`);
    }
    console.log(`  ${parts.join("  ")}`);
  }

  console.log("TRANSFERS");
  if (parsed.transfers.length === 0) {
    console.log("  (none)");
  }
  for (const transfer of parsed.transfers) {
    const from = transfer.from ?? "Mint";
    const to = transfer.to ?? "Burn";
    const amount =
      transfer.token_type === "near"
        ? format_near(transfer.amount)
        : `${transfer.amount} ${transfer.token_type}`;
    console.log(`  ${from} -> ${to}  ${amount}`);
    if (transfer.contract_id !== undefined) {
      console.log(`    contract ${transfer.contract_id}`);
    }
    if (transfer.token_id !== undefined) {
      console.log(`    token   ${transfer.token_id}`);
    }
  }

  console.log("NFT TRANSFERS");
  if (parsed.nft_transfers.length === 0) {
    console.log("  (none)");
  }
  for (const transfer of parsed.nft_transfers) {
    const from = transfer.from ?? "Mint";
    const to = transfer.to ?? "Burn";
    console.log(`  ${from} -> ${to}  #${transfer.token_id}`);
    console.log(`    contract ${transfer.contract_id}`);
  }

  if (parsed.custom_transfers.length > 0) {
    console.log("CUSTOM TRANSFERS");
    for (const transfer of parsed.custom_transfers) {
      console.log(`  ${transfer.from ?? "Mint"} -> ${transfer.to ?? "Burn"}  ${transfer.amount} ${transfer.token_type}`);
    }
  }

  if (seen.has("--full")) {
    console.log("RECEIPTS");
    for (const receipt of parsed.receipts) {
      console.log(
        `  ${receipt.receipt.predecessor_id} -> ${receipt.receipt.receiver_id}  ` +
          `${format_gas(receipt.execution_outcome.outcome.gas_burnt)}  ` +
          `${receipt.execution_outcome.outcome.logs.length} log(s)`,
      );
    }
  }
}
// ========================================
// copyright 2026 by sleet.near
