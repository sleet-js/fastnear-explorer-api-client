// ========================================
// PLUGINS README
// how to add a parser of your own.
//
// THERE IS ONE MASTER PARSER: `parse_transaction`. it runs every
// registered plugin over a transaction and merges what they report.
//
// a plugin is a plain object with an id and one or more hooks. there
// is no base class and no registration call — you just pass the
// object in.
//
// THE SIMPLEST PLUGIN
//
// a plugin that reports a transfer for a token standard this
// package does not know:
//
//   import { parse_transaction } from "@sleet-js/fastnear-explorer-api-client";
//
//   const my_plugin = {
//     id: "myapp.my-token",
//     priority: 500,
//
//     parse_event(event, context, contract_id) {
//       if (event.standard !== "my-standard") return [];
//
//       return [{
//         from: null,
//         to: context.signer_id,
//         amount: "1",
//         token_type: "my-standard",
//         contract_id,
//         extra: { note: "my token" },   // `extra` marks it as custom
//       }];
//     },
//   };
//
//   const result = parse_transaction(tx, { plugins: [my_plugin] });
//
//   result.custom_transfers  // <- your transfers land here
//
// THE HOOKS
//
//   parse_transfers(context)          -> fungible transfers
//   parse_nft_transfers(context)      -> nft transfers
//   parse_event(event, context, id)   -> transfers from one event
//   parse_actions(context)            -> extra parsed actions
//   enrich_actions(context)           -> details for the actions already parsed
//   matches(context)                  -> false to skip the plugin
//
// every hook is optional.
//
// A PLUGIN THAT REPORTS ITS OWN ACTIONS
//
// `parse_actions` is for a protocol whose payload does not fit the
// generic action shape. the actions it returns are APPENDED to the
// parsed list, so the action count grows by one per reported action.
//
//   parse_actions(context)  -> extra parsed actions
//
// the actions land in `result.actions` beside the generic ones, each
// with its own `type`:
//
//   const extra = result.actions.find((a) => a.type === "Mine");
//   extra.my_detail;
//
// A PLUGIN THAT ENRICHES AN ACTION THAT IS ALREADY THERE
//
// when the action is already parsed — a function call, say — a plugin
// that knows something about it should say it ABOUT THAT ACTION, not
// add a second one beside it.
//
// an appended action makes the transaction look like it did more than
// it did. the action count is a fact a reader checks, and "2 actions"
// for one call is a lie.
//
// `enrich_actions` is the hook for that. it returns nothing — the
// details go onto `context.parsed_actions` in place:
//
//   enrich_actions(context) {
//     for (const action of context.parsed_actions) {
//       if (action.method_name !== "__fastdata_fastfs") continue;
//       action.my_detail = decode_my_payload(action.args);
//     }
//   }
//
// `context.parsed_actions` is the very list `result.actions` carries,
// so what a plugin writes on it is what a consumer reads.
//
// FastFS is the one built-in that uses it: the payload is a borsh
// blob, and the details of a file — the path, the mime, the bytes,
// the url — do not fit the flat fields.
//
//   const upload = result.actions.find((a) => a.fastfs !== undefined);
//   upload.fastfs;      // the file
//   upload.fastfs_url;  // where it is served from
//
// the type of the action stays `FunctionCall`. the action IS a
// function call, and the FastFS details are extra facts about it.
//
// PRIORITY
//
// lower runs first. the built-ins use:
//
//   100  near transfers
//   150  delete-account refunds
//   200  nep141
//   300  nep245
//   400  nep171
//   500  fastfs uploads
//
// a consumer plugin with no priority gets 1000, so it runs after the
// built-ins. pass a lower number to run it earlier.
//
// TAKING OVER A BUILT-IN
//
// set `overrides: true` and list the standard in `claims`:
//
//   {
//     id: "myapp.my-nep141",
//     priority: 50,
//     overrides: true,
//     claims: ["nep141"],
//     parse_event(event, context, contract_id) { ... },
//   }
//
// the built-in nep141 plugin is then dropped, so your transfers are
// the only ones reported for that standard.
//
// REUSING A PLUGIN SET
//
// build a registry once and pass it every time:
//
//   import {
//     create_parser_registry,
//     register_parser,
//   } from "@sleet-js/fastnear-explorer-api-client";
//
//   const registry = register_parser(
//     create_parser_registry([...DEFAULT_PLUGINS, my_plugin]),
//     another_plugin,
//   );
//
//   const result = parse_transaction(tx, { registry });
//
// a registry REPLACES the defaults, so include DEFAULT_PLUGINS if
// you still want them.
//
// OR KEEP THE DEFAULTS AND ADD
//
//   const result = parse_transaction(tx, {
//     plugins: [my_plugin],
//     include_defaults: true,   // the default
//   });
//
// ========================================
// copyright 2026 by sleet.near
