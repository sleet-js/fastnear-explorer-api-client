// ========================================
// REGISTER_PARSER
// add a plugin to a registry.
//
// this does NOT change the registry it is given — a new registry is
// returned, so the shared default one stays untouched.
//
// the plugin is placed by PRIORITY, not by insertion order. a plugin
// with no priority gets 1000, which puts it after the built-ins.
// pass a lower priority to run it earlier — a priority below 100
// puts it ahead of every built-in.
// ========================================

import { create_parser_registry } from "./create_parser_registry";
import type { PARSER_REGISTRY } from "../../types/PARSER_REGISTRY";
import type { TRANSFER_PARSER } from "../../types/TRANSFER_PARSER";

export function register_parser(
  registry: PARSER_REGISTRY,
  plugin: TRANSFER_PARSER,
): PARSER_REGISTRY {
  return create_parser_registry([plugin, ...registry.parsers]);
}
// ========================================
// copyright 2026 by sleet.near
