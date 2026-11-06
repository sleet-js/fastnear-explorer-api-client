// ========================================
// PARSE_TRANSACTION
// THE MASTER PARSER.
//
// one entry point. it runs every registered plugin over a
// transaction and returns the merged, normalized result.
//
// it is pure — no network, no dom, no react. the same input always
// gives the same output, so it can be cached and compared.
//
// HOW THE PLUGINS ARE CHOSEN, in order:
//
//   1. `options.registry`   — a registry you built yourself. this
//                             REPLACES the defaults entirely.
//   2. `options.plugins`    — per call. these run ON TOP of the
//                             defaults.
//   3. neither              — the shared default registry.
//
// a plugin with `overrides: true` takes over from any plugin
// claiming the same standard.
//
// WHAT A PLUGIN CAN DO:
//
//   parse_transfers     — report fungible transfers
//   parse_nft_transfers — report nft transfers
//   parse_event         — read one event standard
//   parse_actions       — report extra parsed actions
//   enrich_actions      — add a detail to the actions already parsed
//
// a consumer that wants a transfer the built-ins do not know about
// writes a plugin and hands it in. the built-ins never change.
//
// THE ACTIONS ARE PARSED BEFORE THE PLUGINS RUN.
//
// the context carries the parsed actions, so a plugin can ENRICH an
// action that is already there instead of appending a second one
// beside it. an appended action makes the transaction look like it
// did more than it did, and the action count is a fact a reader
// checks.
//
// TO ADD A CUSTOM PARSER:
//
//   import { parse_transaction } from "@sleet-js/fastnear-explorer-api-client";
//
//   const my_plugin = {
//     id: "myapp.my-token",
//     priority: 500,
//     parse_event(event, context, contract_id) {
//       if (event.standard !== "my-standard") return [];
//       return [{ from: null, to: null, amount: "1",
//                 token_type: "my-standard", contract_id,
//                 extra: {} }];
//     },
//   };
//
//   const result = parse_transaction(tx, { plugins: [my_plugin] });
//
// A PLUGIN THAT MISBEHAVES IS IGNORED, NOT FATAL.
//
// a hook that returns something other than an array is skipped. a
// broken plugin must never take down the parse of a good
// transaction.
// ========================================

import { collect_events } from "./collect_events";
import { parse_action } from "./parse_action";
import { resolve_delegate_context } from "./resolve_delegate_context";
import { resolve_success } from "./resolve_success";
import { resolve_total_gas } from "./resolve_total_gas";
import { create_parser_registry } from "./registry/create_parser_registry";
import { DEFAULT_PARSER_REGISTRY } from "./registry/DEFAULT_PARSER_REGISTRY";
import type { CUSTOM_TRANSFER } from "../types/shared/CUSTOM_TRANSFER";
import type { DELEGATE_CONTEXT } from "../types/shared/DELEGATE_CONTEXT";
import type { NFT_TRANSFER_INFO } from "../types/shared/NFT_TRANSFER_INFO";
import type { PARSE_RESULT } from "../types/shared/PARSE_RESULT";
import type { PARSED_ACTION } from "../types/shared/PARSED_ACTION";
import type { PARSER_CONTEXT } from "../types/shared/PARSER_CONTEXT";
import type { PARSER_OPTIONS } from "../types/shared/PARSER_OPTIONS";
import type { PARSER_REGISTRY } from "../types/shared/PARSER_REGISTRY";
import type { TRANSACTION_DETAIL } from "../types/tx/TRANSACTION_DETAIL";
import type { TRANSFER_INFO } from "../types/shared/TRANSFER_INFO";
import type { TRANSFER_PARSER } from "../types/shared/TRANSFER_PARSER";

export function parse_transaction(
  tx: TRANSACTION_DETAIL,
  options: PARSER_OPTIONS = {},
): PARSE_RESULT {
  const registry = resolve_registry(options);

  // the actions are parsed FIRST, so the context can carry them and a
  // plugin can enrich one in place. the list the plugins write on is
  // the list the result carries, so what a plugin adds is what a
  // consumer reads.
  const delegated = resolve_delegate_context(tx.transaction);
  const actions: PARSED_ACTION[] = delegated.actions.map(parse_action);
  const context = resolve_context(tx, delegated, actions);
  const events = collect_events(tx);

  const transfers: TRANSFER_INFO[] = [];
  const nft_transfers: NFT_TRANSFER_INFO[] = [];
  const custom_transfers: CUSTOM_TRANSFER[] = [];

  for (const plugin of registry.parsers) {
    if (plugin.matches !== undefined && !plugin.matches(context)) continue;

    // a plugin may report extra parsed actions of its own. they are
    // APPENDED, so the action count grows by one per reported action.
    for (const action of as_array<PARSED_ACTION>(plugin.parse_actions?.(context))) {
      actions.push(action);
    }

    // a plugin may add a detail to the actions that are already
    // there. it returns nothing — the details go onto the actions in
    // place, and the count stays what the chain recorded.
    //
    // --- WHY IT IS WRAPPED: a plugin that throws in a hook must not
    // take down the parse of a good transaction. the hook writes on
    // shared state, so a half-written action is possible — but a
    // broken plugin is a broken plugin, and the rest of the parse is
    // worth more than the parse being all-or-nothing.
    try {
      plugin.enrich_actions?.(context);
    } catch (err) {
      console.error(
        `[parse_transaction] plugin "${plugin.id}" failed in enrich_actions`,
        err,
      );
    }

    for (const transfer of as_array<TRANSFER_INFO | CUSTOM_TRANSFER>(
      plugin.parse_transfers?.(context),
    )) {
      push_transfer(transfers, custom_transfers, transfer);
    }

    for (const transfer of as_array<NFT_TRANSFER_INFO>(
      plugin.parse_nft_transfers?.(context),
    )) {
      nft_transfers.push(transfer);
    }

    for (const collected of events) {
      for (const transfer of as_array<
        TRANSFER_INFO | CUSTOM_TRANSFER | NFT_TRANSFER_INFO
      >(
        plugin.parse_event?.(collected.event, context, collected.contract_id),
      )) {
        if (is_nft_transfer(transfer)) {
          nft_transfers.push(transfer);
          continue;
        }
        push_transfer(transfers, custom_transfers, transfer);
      }
    }
  }

  return {
    hash: tx.transaction.hash,
    signer_id: context.signer_id,
    receiver_id: context.receiver_id,
    public_key: tx.transaction.public_key,
    relayer_id: context.relayer_id,
    is_delegated: context.is_delegated,
    block_height: tx.execution_outcome.block_height,
    timestamp: String(tx.execution_outcome.block_timestamp),
    gas_burnt: resolve_total_gas(tx),
    is_success: resolve_success(tx),
    actions,
    transfers,
    nft_transfers,
    custom_transfers,
    receipts: tx.receipts,
    raw: tx,
  };
}

// --- internals ----------------------------------------------------

// a hook that returns something other than an array is ignored. a
// broken plugin must not corrupt or crash the parse.
function as_array<t>(value: unknown): t[] {
  return Array.isArray(value) ? (value as t[]) : [];
}

function resolve_registry(options: PARSER_OPTIONS): PARSER_REGISTRY {
  if (options.registry !== undefined) return options.registry;

  const include_defaults = options.include_defaults ?? true;
  const plugins = options.plugins ?? [];

  if (!include_defaults) {
    return create_parser_registry(plugins);
  }

  return create_parser_registry([...DEFAULT_PARSER_REGISTRY.parsers, ...plugins]);
}

// the context every plugin is handed.
//
// --- WHY THE PARSED ACTIONS GO IN HERE: a plugin that knows something
// about an action that is ALREADY parsed has to be able to say it
// ABOUT THAT ACTION. the parsed list is here, and it is the very list
// the result carries, so a plugin that writes on it changes what the
// consumer reads.
function resolve_context(
  tx: TRANSACTION_DETAIL,
  delegated: DELEGATE_CONTEXT,
  parsed_actions: PARSED_ACTION[],
): PARSER_CONTEXT {
  return {
    signer_id: delegated.signer_id,
    receiver_id: delegated.receiver_id,
    relayer_id: delegated.relayer_id,
    is_delegated: delegated.is_delegated,
    actions: delegated.actions,
    parsed_actions,
    tx,
  };
}

// an nft transfer has a token_id and NO amount. a fungible transfer
// always has an amount. a custom transfer is never an nft, even if
// it carries a token_id — the `extra` marker means a consumer's own
// plugin reported it.
function is_nft_transfer(
  transfer: TRANSFER_INFO | CUSTOM_TRANSFER | NFT_TRANSFER_INFO,
): transfer is NFT_TRANSFER_INFO {
  if ("extra" in transfer) return false;
  if ("amount" in transfer) return false;
  return "token_id" in transfer && transfer.token_id !== undefined;
}

function push_transfer(
  transfers: TRANSFER_INFO[],
  custom_transfers: CUSTOM_TRANSFER[],
  transfer: TRANSFER_INFO | CUSTOM_TRANSFER,
): void {
  if ("extra" in transfer) {
    custom_transfers.push(transfer as CUSTOM_TRANSFER);
    return;
  }
  transfers.push(transfer as TRANSFER_INFO);
}
// ========================================
// copyright 2026 by sleet.near
