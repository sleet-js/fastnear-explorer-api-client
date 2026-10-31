#!/usr/bin/env bun
// ========================================
// PARSE_ARGS
// the bin that shows a function call's decoded arguments.
//
// this is the piece the fastnear frontend does inside its
// Base64Data component — here it is on its own, so a ui can use it
// without a react tree.
//
// argv:
//   bun bin/parse_args.ts <tx_hash> [--action n] [--hex]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/parse_args.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
//   bun bin/parse_args.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg --hex
// ========================================

import {
  api_transactions,
  args_view_modes,
  bytes_to_hex,
  default_args_view_mode,
  parse_transaction,
} from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--hex", "--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const tx_hash = positional[0];
if (tx_hash === undefined) {
  console.error("usage: bun bin/parse_args.ts <tx_hash> [--action n] [--hex]");
  process.exit(1);
}

const network = resolve_network(flags, seen);
const action_index = Number(flags.get("--action") ?? "0");

const response = await api_transactions({
  tx_hashes: [tx_hash],
  config: { network },
  quiet: true,
});

if (response.transactions.length === 0) {
  console.log("PARSED", "no transaction found");
  process.exit(0);
}

const parsed = parse_transaction(response.transactions[0]!);
const action = parsed.actions[action_index];

if (action === undefined) {
  console.log(`PARSED action ${action_index} does not exist`);
  process.exit(0);
}

console.log("ACTION", action_index, action.type, action.method_name ?? "");

const decoded = action.args_decoded;
if (decoded === undefined) {
  console.log("  (this action has no args)");
  process.exit(0);
}

console.log("  views        ", args_view_modes(decoded.json !== null).join(", "));
console.log("  default view ", default_args_view_mode(decoded.json !== null, decoded.is_printable));
console.log("  printable    ", decoded.is_printable);
console.log("  size         ", `${decoded.bytes.length} bytes`);

if (seen.has("--hex")) {
  console.log("\n  HEX");
  console.log(`  ${bytes_to_hex(decoded.bytes)}`);
} else if (decoded.json !== null) {
  console.log("\n  JSON");
  console.log(JSON.stringify(decoded.json, null, 2));
} else {
  console.log("\n  TEXT");
  console.log(`  ${decoded.text}`);
}
// ========================================
// copyright 2026 by sleet.near
