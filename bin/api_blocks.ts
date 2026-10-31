#!/usr/bin/env bun
// ========================================
// API_BLOCKS
// runnable bin for POST /v0/blocks — the recent block list.
//
// argv:
//   bun bin/api_blocks.ts [--limit n] [--from h] [--to h] [--desc]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_blocks.ts --limit 5
//   bun bin/api_blocks.ts --limit 5 --desc
//   bun bin/api_blocks.ts --from 222453000 --to 222453010
//   bun bin/api_blocks.ts --limit 3 --testnet
// ========================================

import { api_blocks } from "../src/index";
import { check_limit } from "./fun/check_limit";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--desc", "--testnet"];

// --- argv ----------------------------------------------------------
const { flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (process.argv.length <= 2) {
  console.error(
    "usage: bun bin/api_blocks.ts [--limit n] [--from h] [--to h] [--desc] [--network mainnet|testnet]",
  );
  process.exit(1);
}

const network = resolve_network(flags, seen);
const limit = check_limit(flags.get("--limit"), { min: 1, max: 100 });
const from = flags.get("--from");
const to = flags.get("--to");

const response = await api_blocks({
  limit,
  from_block_height: from !== undefined ? Number(from) : undefined,
  to_block_height: to !== undefined ? Number(to) : undefined,
  desc: seen.has("--desc"),
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
console.log(
  "BLOCKS",
  `${response.blocks.length} row(s) on ${network}` +
    (seen.has("--desc") ? " newest first" : " oldest first"),
);
for (const block of response.blocks) {
  console.log(
    `  ${block.block_height}  ${block.block_hash}  ${block.author_id}  ` +
      `${block.num_transactions} tx(s)  ${block.num_receipts} receipt(s)`,
  );
}
// ========================================
// copyright 2026 by sleet.near
