#!/usr/bin/env bun
// ========================================
// API_RPC_CALL_FUNCTION
// runnable bin for a contract call through the json-rpc node.
//
// the two that matter for token display are ft_metadata and
// mt_metadata_base_by_token_id.
//
// argv:
//   bun bin/api_rpc_call_function.ts <contract_id> <method_name> [--args json]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_rpc_call_function.ts batman-4.nearlytrade.near ft_metadata
//   bun bin/api_rpc_call_function.ts wrap.near ft_metadata --json
// ========================================

import { api_rpc_call_function } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--json", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const contract_id = positional[0];
const method_name = positional[1];

if (contract_id === undefined || method_name === undefined) {
  console.error(
    "usage: bun bin/api_rpc_call_function.ts <contract_id> <method_name> [--args json]",
  );
  process.exit(1);
}

const network = resolve_network(flags, seen);

const args_raw = flags.get("--args");
let args: Record<string, unknown> = {};
if (args_raw !== undefined) {
  try {
    args = JSON.parse(args_raw) as Record<string, unknown>;
  } catch {
    console.error("--args must be valid json");
    process.exit(1);
  }
}

const result = await api_rpc_call_function({
  contract_id,
  method_name,
  args,
  config: { network },
});

// --- summary -------------------------------------------------------
if (result === null) {
  console.log("CALL", method_name, "on", contract_id, "-> no result");
} else if (seen.has("--json")) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log("CALL", method_name, "on", contract_id);
  console.log(JSON.stringify(result, null, 2));
}
// ========================================
// copyright 2026 by sleet.near
