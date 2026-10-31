// ========================================
// PARSER_OPTIONS
// options for parse_transaction.
//
// THREE WAYS TO EXTEND THE PARSER:
//
//   1. `plugins` — per call. these run on top of the defaults.
//   2. `registry` — a registry you built yourself. this REPLACES the
//      defaults, so include the built-ins if you still want them.
//   3. neither — the shared default registry.
//
// `include_defaults: false` keeps the defaults but lets a plugin with
// `overrides: true` take over from them.
// ========================================

import type { PARSER_REGISTRY } from "./PARSER_REGISTRY";
import type { TRANSFER_PARSER } from "./TRANSFER_PARSER";

export interface PARSER_OPTIONS {
  plugins?: TRANSFER_PARSER[];
  registry?: PARSER_REGISTRY;
  include_defaults?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
