// ========================================
// RESOLVE_NETWORK
// bin primitive that turns a --network flag into a NETWORK_ID.
//
// the default is mainnet. `--testnet` is accepted as a shorthand,
// and `--network testnet` as the explicit form.
// ========================================

import type { NETWORK_ID } from "../../src/types/shared/NETWORK_ID.js";

export function resolve_network(
  flags: Map<string, string>,
  seen: Set<string>,
): NETWORK_ID {
  const explicit = flags.get("--network");
  if (explicit !== undefined) {
    if (explicit !== "mainnet" && explicit !== "testnet") {
      console.error("--network must be mainnet or testnet");
      process.exit(1);
    }
    return explicit;
  }
  if (seen.has("--testnet")) return "testnet";
  return "mainnet";
}
// ========================================
// copyright 2026 by sleet.near
