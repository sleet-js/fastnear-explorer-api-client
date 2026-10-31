// ========================================
// DEFAULT_PARSER_REGISTRY
// the shared registry of the built-in plugins.
//
// parse_transaction uses this when the caller passes no plugins and
// no registry.
//
// it is frozen on purpose — use register_parser to get a registry
// with an extra plugin rather than changing this one.
// ========================================

import { create_parser_registry } from "./create_parser_registry";
import { DEFAULT_PLUGINS } from "../plugins/DEFAULT_PLUGINS";
import type { PARSER_REGISTRY } from "../../types/PARSER_REGISTRY";

export const DEFAULT_PARSER_REGISTRY: PARSER_REGISTRY = Object.freeze(
  create_parser_registry(DEFAULT_PLUGINS),
);
// ========================================
// copyright 2026 by sleet.near
