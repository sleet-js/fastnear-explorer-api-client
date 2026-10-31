#!/usr/bin/env bun
// ========================================
// API_STATUS
// runnable bin for the service status and health.
//
// this is the call to make when the indexer looks behind — the
// balances lag the blocks.
//
// argv:
//   bun bin/api_status.ts [--health]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_status.ts
//   bun bin/api_status.ts --health
// ========================================

import { api_health, api_status } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--health", "--testnet"];

// --- argv ----------------------------------------------------------
const { flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const network = resolve_network(flags, seen);

if (seen.has("--health")) {
  const health = await api_health({ config: { network } });
  console.log("HEALTH", health.status);
  process.exit(0);
}

const status = await api_status({ config: { network } });

// --- summary -------------------------------------------------------
console.log("STATUS", status.version);
console.log(`  indexed height      ${status.sync_block_height}`);
console.log(`  balance height      ${status.sync_balance_block_height}`);
console.log(`  latency             ${status.sync_latency_sec?.toFixed(2)}s`);
console.log(`  block timestamp     ${status.sync_block_timestamp_nanosec}`);

if (
  status.sync_block_height !== null &&
  status.sync_balance_block_height !== null &&
  status.sync_balance_block_height < status.sync_block_height
) {
  console.log(
    `  note: balances are ${status.sync_block_height - status.sync_balance_block_height} block(s) behind`,
  );
}
// ========================================
// copyright 2026 by sleet.near
