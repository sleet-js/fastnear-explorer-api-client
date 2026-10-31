// ========================================
// ACTION
// one action in a transaction or receipt.
//
// THE SHAPE IS NOT UNIFORM.
//
// most actions arrive as a single-key object keyed by the action
// name:
//
//     { "FunctionCall": {...} }
//     { "Transfer": {...} }
//
// but a unit variant arrives as a bare string. `CreateAccount` is the
// one in use today:
//
//     "CreateAccount"
//
// THAT IS WHY THERE IS NO CATCH-ALL ARM.
//
// a union arm of `{ [key: string]: unknown }` would match every
// object arm, and TypeScript could no longer tell the arms apart —
// `action.Transfer` would be `unknown` and no switch would narrow.
// leaving the union closed is what keeps the action types usable.
//
// an action name the protocol adds later therefore does NOT fit this
// union. that is deliberate. the api may add one in a future
// protocol version, and it still round-trips untouched through
// PARSED_ACTION.raw — but a consumer has to handle it at runtime.
//
// the runtime helpers for that are exported:
//
//   get_action_type(action)     -> the name, whatever it is
//   get_action_payload(action)  -> the body, whatever it is
//
// TO READ AN ACTION'S BODY:
//
//   if (typeof action === "string") {
//     // "CreateAccount" — a unit action, no body
//   } else if ("Transfer" in action) {
//     action.Transfer.deposit;
//   }
//
// the `typeof` check comes first because a string is not an object.
// ========================================

import type { ENVELOPED_ACTION } from "./ENVELOPED_ACTION.js";
import type { UNIT_ACTION } from "./UNIT_ACTION.js";

export type ACTION = UNIT_ACTION | ENVELOPED_ACTION;
// ========================================
// copyright 2026 by sleet.near
