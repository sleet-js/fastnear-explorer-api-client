// ========================================
// PARSER_REGISTRY
// an ordered set of plugins.
//
// the registry is the seam for extending the parser. build one with
// create_parser_registry, or let parse_transaction use the shared
// default one.
// ========================================

import type { TRANSFER_PARSER } from "./TRANSFER_PARSER";

export interface PARSER_REGISTRY {
  parsers: TRANSFER_PARSER[];
}
// ========================================
// copyright 2026 by sleet.near
