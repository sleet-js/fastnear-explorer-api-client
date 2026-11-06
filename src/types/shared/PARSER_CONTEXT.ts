// ========================================
// PARSER_CONTEXT
// what every parser plugin is handed.
//
// the context already accounts for delegate actions: for a relayed
// transaction `signer_id` / `receiver_id` / `actions` are the
// DELEGATED ones — the real economic actor — while `relayer_id`
// holds the outer signer who paid the gas.
//
// `tx` is the raw transaction, for plugins that need anything this
// package does not model.
//
// `parsed_actions` are the ALREADY PARSED actions — the flat,
// renderable shape, one per entry of `actions` and in the same order.
// they are here so a plugin can ENRICH an action instead of adding a
// second one beside it.
//
// --- WHY THE PARSED ACTIONS ARE IN THE CONTEXT: a plugin that
// APPENDS an action makes the transaction look like it did more than
// it did. the action count is a fact a reader checks, so a plugin
// that knows something about an action has to be able to say it
// ABOUT THAT ACTION. `parsed_actions` is the list to write on.
//
// --- WHY THEY ARE IN THE CONTEXT AND NOT A SEPARATE HOOK ARGUMENT:
// the context is what every hook already receives, so a plugin that
// enriches needs no new plumbing and no new contract shape — it
// reads `context.parsed_actions` and writes on the one it recognises.
// ========================================

import type { ACTION } from "../tx/ACTION";
import type { PARSED_ACTION } from "./PARSED_ACTION";
import type { TRANSACTION_DETAIL } from "../tx/TRANSACTION_DETAIL";

export interface PARSER_CONTEXT {
  signer_id: string;
  receiver_id: string;
  relayer_id: string | null;
  is_delegated: boolean;
  /** the raw actions, as the chain signed them. */
  actions: ACTION[];
  /**
   * the parsed actions, one per entry of `actions` and in the same
   * order.
   *
   * a plugin may ENRICH these in place — add a field to the action it
   * recognises, and leave the count alone. the list is the same one
   * the parse result carries, so what a plugin writes here is what a
   * consumer reads.
   */
  parsed_actions: PARSED_ACTION[];
  tx: TRANSACTION_DETAIL;
}
// ========================================
// copyright 2026 by sleet.near
