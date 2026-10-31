#!/usr/bin/env bun
// ========================================
// PARSE_VERIFY
// the verification bin — this is what replaces the test files.
//
// it pulls a live corpus of transactions, parses every one of them,
// and checks the invariants that matter:
//
//   1. nothing throws
//   2. every parse has a hash
//   3. a success status resolves to true/false, never null for a
//      settled transaction
//   4. gas is never negative
//   5. every transfer has an amount and a token type
//   6. a transfer's from/to is never an empty string
//   7. every action has a type
//   8. a delegated transaction reports a relayer
//   9. a delegated transaction's signer is the delegate's sender
//
// it walks recent blocks, so the corpus is always fresh.
//
// argv:
//   bun bin/parse_verify.ts [--blocks n] [--txs n] [--network mainnet|testnet]
//
// examples:
//   bun bin/parse_verify.ts
//   bun bin/parse_verify.ts --blocks 20 --txs 100
// ========================================

import {
  api_block,
  api_blocks,
  api_transactions,
  create_parser_registry,
  DEFAULT_PARSER_REGISTRY,
  parse_transaction,
  TRANSACTIONS_BATCH_SIZE,
} from "../src/index";
import type { TRANSACTION_DETAIL, TRANSFER_PARSER } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";
import { throttle } from "./fun/throttle";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--quiet", "--testnet"];

// --- argv ----------------------------------------------------------
const { flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const network = resolve_network(flags, seen);
const block_count = Number(flags.get("--blocks") ?? "10");
const tx_limit = Number(flags.get("--txs") ?? "60");

// --- corpus --------------------------------------------------------
console.log(`collecting corpus from ${network}...`);

const blocks = await api_blocks({
  limit: Math.min(block_count, 100),
  desc: true,
  config: { network },
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

console.log(`collecting ${hashes.length} transaction(s)...`);

const transactions: TRANSACTION_DETAIL[] = [];
for (let i = 0; i < hashes.length; i += TRANSACTIONS_BATCH_SIZE) {
  const batch = hashes.slice(i, i + TRANSACTIONS_BATCH_SIZE);
  const response = await api_transactions({
    tx_hashes: batch,
    config: { network },
  });
  transactions.push(...response.transactions);
}

console.log(`parsed ${transactions.length} transaction(s)\n`);

// --- checks --------------------------------------------------------
console.log("checking the OVERRIDES mechanism...");

{
  // find a transaction that actually has a nep141 event, so the
  // override has something to replace.
  const with_nep141 = transactions.find((tx) =>
    parse_transaction(tx).transfers.some((t) => t.token_type === "nep141"),
  );

  if (with_nep141 === undefined) {
    console.error("  FAIL: no transaction in the corpus had a nep141 transfer");
    process.exit(1);
  }

  // a plugin that claims nep141 must REPLACE the built-in, so only
  // its transfers come back — not both.
  const override_plugin: TRANSFER_PARSER = {
    id: "verify.override-nep141",
    priority: 50,
    overrides: true,
    claims: ["nep141"],
    parse_event(event) {
      // only answer for the standard it takes over — otherwise the
      // plugin would fire for every event in the transaction.
      if (event.standard !== "nep141") return [];
      return [
        {
          from: null,
          to: "override.near",
          amount: "999",
          token_type: "nep141",
          contract_id: "override.near",
        },
      ];
    },
  };

  const without = parse_transaction(with_nep141);
  const with_override = parse_transaction(with_nep141, {
    plugins: [override_plugin],
  });

  const builtin_nep141 = without.transfers.filter(
    (t) => t.token_type === "nep141",
  );
  const override_nep141 = with_override.transfers.filter(
    (t) => t.token_type === "nep141",
  );

  if (builtin_nep141.length === 0) {
    console.error("  FAIL: the built-in reported no nep141 transfer to replace");
    process.exit(1);
  }

  // the override fires once per nep141 EVENT, so there may be more
  // than one. what matters is that none of them is the built-in's
  // own transfer — they must all be the override's.
  if (override_nep141.length === 0) {
    console.error("  FAIL: the override reported no nep141 transfer");
    process.exit(1);
  }

  // every nep141 transfer must now be the override's — none of the
  // built-in's may survive.
  if (override_nep141.some((transfer) => transfer.amount !== "999")) {
    console.error(
      "  FAIL: a built-in nep141 transfer survived the override",
    );
    process.exit(1);
  }

  // and the built-in's own amounts must be gone.
  const builtin_amounts = new Set(builtin_nep141.map((t) => t.amount));
  const leaked = override_nep141.filter((t) => builtin_amounts.has(t.amount));
  if (leaked.length > 0) {
    console.error(
      `  FAIL: ${leaked.length} built-in transfer(s) survived the override`,
    );
    process.exit(1);
  }

  console.log(
    `  ok: the built-in reported ${builtin_nep141.length} nep141 transfer(s), the override replaced all of them`,
  );
}

{
  // the override must win at EQUAL priority too, not only at a lower
  // one. a silent no-op here would double-count every transfer.
  console.log("checking the OVERRIDES priority rules...");

  const make_plugin = (id: string, priority: number) =>
    ({
      id,
      priority,
      overrides: true,
      claims: ["nep141"],
      parse_event: () => [],
    }) as TRANSFER_PARSER;

  const ids_of = (plugins: TRANSFER_PARSER[]): string[] =>
    create_parser_registry([
      ...DEFAULT_PARSER_REGISTRY.parsers,
      ...plugins,
    ]).parsers.map((plugin) => plugin.id);

  // lower priority — the override wins.
  const lower = ids_of([make_plugin("verify.lower", 50)]);
  if (lower.includes("builtin.nep141-transfer")) {
    console.error("  FAIL: a lower priority override did not replace the built-in");
    process.exit(1);
  }
  if (!lower.includes("verify.lower")) {
    console.error("  FAIL: the lower priority override was dropped");
    process.exit(1);
  }

  // equal priority — the override still wins.
  const equal = ids_of([make_plugin("verify.equal", 200)]);
  if (equal.includes("builtin.nep141-transfer")) {
    console.error("  FAIL: an equal priority override did not replace the built-in");
    process.exit(1);
  }
  if (!equal.includes("verify.equal")) {
    console.error("  FAIL: the equal priority override was dropped");
    process.exit(1);
  }

  // higher priority — it runs after the built-in, so both stay.
  const higher = ids_of([make_plugin("verify.higher", 201)]);
  if (!higher.includes("builtin.nep141-transfer")) {
    console.error("  FAIL: a later override wrongly removed the built-in");
    process.exit(1);
  }

  // two overriders — only the higher priority one survives.
  const two = ids_of([
    make_plugin("verify.first", 10),
    make_plugin("verify.second", 20),
  ]);
  if (two.includes("verify.second")) {
    console.error("  FAIL: the lower priority of two overriders was kept");
    process.exit(1);
  }
  if (!two.includes("verify.first")) {
    console.error("  FAIL: the higher priority of two overriders was dropped");
    process.exit(1);
  }

  console.log("  ok: lower, equal, higher priority and two overriders all behave");
}

const failures: string[] = [];
let action_count = 0;
let transfer_count = 0;
let nft_count = 0;
let delegated_count = 0;
let success_count = 0;
let failed_count = 0;
let pending_count = 0;

for (const tx of transactions) {
  const label = tx.transaction.hash;

  let parsed;
  try {
    parsed = parse_transaction(tx);
  } catch (error) {
    failures.push(`${label}: parse threw ${String(error)}`);
    continue;
  }

  if (parsed.hash !== tx.transaction.hash) {
    failures.push(`${label}: hash mismatch`);
  }

  if (parsed.gas_burnt < 0) {
    failures.push(`${label}: negative gas ${parsed.gas_burnt}`);
  }

  if (parsed.is_success === true) success_count++;
  else if (parsed.is_success === false) failed_count++;
  else pending_count++;

  for (const action of parsed.actions) {
    action_count++;
    if (typeof action.type !== "string" || action.type.length === 0) {
      failures.push(`${label}: action without a type`);
    }
  }

  for (const transfer of parsed.transfers) {
    transfer_count++;
    if (typeof transfer.amount !== "string") {
      failures.push(`${label}: transfer without an amount`);
    }
    if (typeof transfer.token_type !== "string") {
      failures.push(`${label}: transfer without a token type`);
    }
    if (transfer.from === "" || transfer.to === "") {
      failures.push(`${label}: transfer with an empty owner`);
    }
  }

  for (const transfer of parsed.nft_transfers) {
    nft_count++;
    if (transfer.token_id.length === 0) {
      failures.push(`${label}: nft transfer without a token id`);
    }
    if (transfer.from === "" || transfer.to === "") {
      failures.push(`${label}: nft transfer with an empty owner`);
    }
  }

  if (parsed.is_delegated) {
    delegated_count++;
    if (parsed.relayer_id === null) {
      failures.push(`${label}: delegated but no relayer`);
    }
    if (parsed.signer_id === tx.transaction.signer_id) {
      failures.push(`${label}: delegated but the signer is the relayer`);
    }
  }

  // a transaction whose own status is settled must resolve to
  // true or false — never to null. null means "still settling".
  const own_status = tx.execution_outcome.outcome.status;
  if ("SuccessValue" in own_status && parsed.is_success === null) {
    failures.push(`${label}: settled but the success status is null`);
  }
  if ("Failure" in own_status && parsed.is_success !== false) {
    failures.push(`${label}: failed but the success status is not false`);
  }
}

// --- report --------------------------------------------------------
console.log("PARSED");
console.log(`  transactions   ${transactions.length}`);
console.log(`  actions        ${action_count}`);
console.log(`  transfers      ${transfer_count}`);
console.log(`  nft transfers  ${nft_count}`);
console.log(`  delegated      ${delegated_count}`);
console.log(
  `  success        ${success_count} ok, ${failed_count} failed, ${pending_count} pending`,
);

if (failures.length === 0) {
  console.log("\nALL CHECKS PASSED");
  process.exit(0);
}

console.log(`\n${failures.length} FAILURE(S):`);
for (const failure of failures.slice(0, 50)) {
  console.log(`  ${failure}`);
}
if (failures.length > 50) {
  console.log(`  ... and ${failures.length - 50} more`);
}
process.exit(1);
// ========================================
// copyright 2026 by sleet.near
