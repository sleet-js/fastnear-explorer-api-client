#!/usr/bin/env bun
// ========================================
// API_PUBLIC_KEY
// runnable bin for the public key lookups.
//
// THE ANSWER TO "which accounts share this key?".
//
// argv:
//   bun bin/api_public_key.ts <public_key> [--all] [--legacy]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_public_key.ts ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3
//   bun bin/api_public_key.ts ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3 --all
//   bun bin/api_public_key.ts ed25519:11111111111111111111111111111111 --all
// ========================================

import { api_public_key } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--all", "--legacy", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const public_key = positional[0];
if (public_key === undefined) {
  console.error("usage: bun bin/api_public_key.ts <public_key> [--all] [--legacy]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const response = await api_public_key({
  public_key,
  include_all: seen.has("--all"),
  legacy: seen.has("--legacy"),
  config: { network },
    quiet: true,
});

// --- summary -------------------------------------------------------
console.log("PUBLIC KEY", response.public_key);
console.log(
  "  lookup       ",
  seen.has("--legacy") ? "v0" : "v1",
  seen.has("--all") ? "(every access type)" : "(full access only)",
);
console.log(`  accounts     ${response.account_ids.length}`);
for (const account_id of response.account_ids) {
  console.log(`    ${account_id}`);
}
if (response.account_ids.length === 0) {
  console.log("  (no account has registered this key)");
}
// ========================================
// copyright 2026 by sleet.near
