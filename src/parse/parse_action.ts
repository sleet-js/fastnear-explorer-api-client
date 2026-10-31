// ========================================
// PARSE_ACTION
// flatten one action into the shape a ui can render.
//
// the raw action is a nested single-key object; PARSED_ACTION is flat
// with a `type` field saying what it was.
//
// an action name this package does not know becomes
// `{ type: "Unknown" }` with the raw action kept — so a new
// protocol action never breaks a switch statement and never gets
// silently dropped.
//
// the delegate action is NOT unwrapped here. parse_transaction does
// that, because the unwrapped inner actions replace the outer list
// entirely.
// ========================================

import { base58_from_base64 } from "./base58_from_base64";
import { decode_args } from "./decode_args";
import { get_action_payload } from "./get_action_payload";
import { get_action_type } from "./get_action_type";
import { read_access_key_permission } from "./read_access_key_permission";
import type { ACTION } from "../types/tx/ACTION";
import type { PARSED_ACTION } from "../types/shared/PARSED_ACTION";

export function parse_action(action: ACTION): PARSED_ACTION {
  const type = get_action_type(action);

  if (type === null) {
    return { type: "Unknown", raw: action };
  }

  const payload = get_action_payload(action);
  const parsed: PARSED_ACTION = { type, raw: action };

  if (payload === null) return parsed;

  if (typeof payload["method_name"] === "string") {
    parsed.method_name = payload["method_name"];
  }
  if (typeof payload["deposit"] === "string") {
    parsed.deposit = payload["deposit"];
  }
  if (typeof payload["stake"] === "string") {
    parsed.stake = payload["stake"];
  }
  if (typeof payload["args"] === "string") {
    parsed.args = payload["args"];
    // the decoded form, so a ui does not have to decode it again.
    parsed.args_decoded = decode_args(payload["args"]);
  }
  if (typeof payload["gas"] === "number") {
    parsed.gas = payload["gas"];
  }
  if (typeof payload["public_key"] === "string") {
    parsed.public_key = payload["public_key"];
  }
  if (typeof payload["beneficiary_id"] === "string") {
    parsed.beneficiary_id = payload["beneficiary_id"];
  }
  if (typeof payload["code_hash"] === "string") {
    parsed.code_hash = payload["code_hash"];
  }
  if (typeof payload["code"] === "string") {
    // DeployContract carries the code hash as base64. near shows it
    // as base58, so convert it here.
    const code_hash_base58 = base58_from_base64(payload["code"]);
    if (code_hash_base58 !== null) {
      parsed.code_hash_base58 = code_hash_base58;
    }
  }

  const permission = read_access_key_permission(payload);
  if (permission !== null) parsed.access_key_permission = permission;

  return parsed;
}
// ========================================
// copyright 2026 by sleet.near
