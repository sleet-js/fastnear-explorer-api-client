// ========================================
// TRANSFER_PARSER
// the interface a consumer implements to add their own transfer
// parsing.
//
// a plugin may implement `parse_transfers` (fungible),
// `parse_nft_transfers` (non-fungible), `parse_event` (a hook for
// one event standard), `parse_actions` (one that produces extra
// parsed actions) or `enrich_actions` (one that adds a detail to the
// actions that are already parsed). every hook is optional; a plugin
// that implements none is a no-op.
//
// `parse_actions` APPENDS. `enrich_actions` MODIFIES.
//
// a plugin that appends an action makes the transaction look like it
// did more than it did — the action count is a fact a reader checks.
// so a plugin that knows something about an action that is ALREADY
// there enriches it instead of adding a second one beside it.
//
//   parse_actions(context)   -> extra parsed actions, APPENDED
//   enrich_actions(context)  -> nothing. the details are written onto
//                               `context.parsed_actions` in place.
//
// PRIORITY: lower number runs first. the built-ins use 100..400,
// consumer plugins default to 1000.
//
// OVERRIDES: by default a plugin's results are APPENDED to the
// built-ins'. to REPLACE a built-in instead, set `overrides: true`
// and list the standards you take over in `claims`:
//
//   {
//     id: "myapp.my-nep141",
//     priority: 50,
//     overrides: true,
//     claims: ["nep141"],
//     parse_event(event, context, contract_id) { ... },
//   }
//
// any plugin of EQUAL OR LOWER priority claiming "nep141" is then
// dropped, so your transfers are the only ones reported.
//
// an override only beats a plugin of equal or lower priority. an
// override at priority 201 would run AFTER the built-in nep141
// plugin (200), so it adds to it rather than replacing it. use a
// priority of 50 or lower to be sure you run first.
// ========================================

import type { CUSTOM_TRANSFER } from "./CUSTOM_TRANSFER";
import type { EVENT_JSON } from "./EVENT_JSON";
import type { NFT_TRANSFER_INFO } from "./NFT_TRANSFER_INFO";
import type { PARSED_ACTION } from "./PARSED_ACTION";
import type { PARSER_CONTEXT } from "./PARSER_CONTEXT";
import type { TRANSFER_INFO } from "./TRANSFER_INFO";

export interface TRANSFER_PARSER {
  id: string;
  priority?: number;
  overrides?: boolean;
  /** the standards this plugin takes over when `overrides` is true. */
  claims?: string[];
  matches?: (context: PARSER_CONTEXT) => boolean;
  parse_transfers?: (
    context: PARSER_CONTEXT,
  ) => (TRANSFER_INFO | CUSTOM_TRANSFER)[] | void;
  parse_nft_transfers?: (
    context: PARSER_CONTEXT,
  ) => NFT_TRANSFER_INFO[] | void;
  parse_event?: (
    event: EVENT_JSON,
    context: PARSER_CONTEXT,
    receipt_contract_id: string,
  ) => (TRANSFER_INFO | CUSTOM_TRANSFER | NFT_TRANSFER_INFO)[] | void;
  /**
   * report EXTRA parsed actions.
   *
   * they are APPENDED to the parsed list, so the action count grows
   * by one per reported action. use `enrich_actions` when the action
   * is already there.
   */
  parse_actions?: (context: PARSER_CONTEXT) => PARSED_ACTION[] | void;
  /**
   * ENRICH the actions that are already parsed.
   *
   * it returns nothing — the details are written onto the entries of
   * `context.parsed_actions` in place. the count does not change, so
   * a transaction with one FastFS call still has one action.
   */
  enrich_actions?: (context: PARSER_CONTEXT) => void;
}
// ========================================
// copyright 2026 by sleet.near
