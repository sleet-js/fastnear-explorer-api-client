#!/usr/bin/env bun
// ========================================
// API_ACCOUNT_TOKENS
// runnable bin for the account token and pool lookups.
//
// the v1 paths answer with full rows, the v0 paths with ids only.
//
// argv:
//   bun bin/api_account_tokens.ts <account_id> [--ft] [--nft] [--staking]
//       [--ids] [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_account_tokens.ts near --ft
//   bun bin/api_account_tokens.ts near --nft --ids
//   bun bin/api_account_tokens.ts near --staking
// ========================================

import {
  api_account_contracts,
  api_account_ft,
  api_account_nft,
  api_account_staking,
  api_account_staking_ids,
} from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--ft", "--nft", "--staking", "--ids", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const account_id = positional[0];
if (account_id === undefined) {
  console.error(
    "usage: bun bin/api_account_tokens.ts <account_id> [--ft] [--nft] [--staking] [--ids]",
  );
  process.exit(1);
}

const network = resolve_network(flags, seen);
const ids_only = seen.has("--ids");

// with no flag at all, show all three.
const show_ft = seen.has("--ft") || (!seen.has("--nft") && !seen.has("--staking"));
const show_nft =
  seen.has("--nft") || (!seen.has("--ft") && !seen.has("--staking"));
const show_staking =
  seen.has("--staking") ||
  (!seen.has("--ft") && !seen.has("--nft") && !seen.has("--ids"));

// --- summary -------------------------------------------------------
if (show_ft) {
  if (ids_only) {
    const response = await api_account_contracts({
      account_id,
      kind: "ft",
      config: { network },
    quiet: true,
    });
    console.log("FT CONTRACTS", response?.contract_ids.length ?? 0);
    for (const contract_id of response?.contract_ids ?? []) {
      console.log(`  ${contract_id}`);
    }
  } else {
    const response = await api_account_ft({ account_id, config: { network } });
    console.log("FT TOKENS", response?.tokens.length ?? 0);
    for (const token of response?.tokens ?? []) {
      console.log(`  ${token.contract_id}  ${token.balance}`);
    }
  }
}

if (show_nft) {
  if (ids_only) {
    const response = await api_account_contracts({
      account_id,
      kind: "nft",
      config: { network },
    });
    console.log("NFT CONTRACTS", response?.contract_ids.length ?? 0);
    for (const contract_id of response?.contract_ids ?? []) {
      console.log(`  ${contract_id}`);
    }
  } else {
    const response = await api_account_nft({ account_id, config: { network } });
    console.log("NFT CONTRACTS", response?.tokens.length ?? 0);
    for (const token of response?.tokens ?? []) {
      console.log(`  ${token.contract_id}`);
    }
  }
}

if (show_staking) {
  if (ids_only) {
    const response = await api_account_staking_ids({
      account_id,
      config: { network },
    quiet: true,
    });
    console.log("STAKING POOLS", response?.pools.length ?? 0);
    for (const pool_id of response?.pools ?? []) {
      console.log(`  ${pool_id}`);
    }
  } else {
    const response = await api_account_staking({ account_id, config: { network } });
    console.log("STAKING POOLS", response?.pools.length ?? 0);
    for (const pool of response?.pools ?? []) {
      console.log(`  ${pool.pool_id}`);
    }
  }
}
// ========================================
// copyright 2026 by sleet.near
