#!/usr/bin/env bun
// ========================================
// API_LOG_FORMAT
// show the framed log block a call prints.
//
// this is the bin to reach for when you want to see the log format
// the middleman packages use:
//
//   =============================
//    LABEL via POST on: https://...
//   RESPONSE STATUS: 200 - OK
//   RESPONSE: { ... }
//   =============================
//
// pass --quiet to see the same call with the log turned off.
//
// argv:
//   bun bin/api_log_format.ts [--quiet]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/api_log_format.ts
//   bun bin/api_log_format.ts --quiet
// ========================================

import { api_status } from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--quiet", "--testnet"];

// --- argv ----------------------------------------------------------
const { flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const network = resolve_network(flags, seen);

if (seen.has("--quiet")) {
  console.log("--- quiet: true — nothing below this line ---");
}

const status = await api_status({
  config: { network },
  quiet: seen.has("--quiet"),
});

if (seen.has("--quiet")) {
  console.log("--- end quiet ---");
  console.log("the call still returned:", status.version);
} else {
  console.log("--- the frame above is the log ---");
  console.log("the call still returned:", status.version);
}
// ========================================
// copyright 2026 by sleet.near
