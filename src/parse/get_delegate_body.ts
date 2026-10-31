// ========================================
// GET_DELEGATE_BODY
// the inner body of a delegate action.
//
// returns null when the action is not a delegate or the body is
// missing — a malformed delegate must not take the whole parse down.
//
// the inner actions are in the SAME enveloped form as top-level
// actions (`{ "FunctionCall": {...} }`), not a flat form.
// ========================================

import { get_action_payload } from "./get_action_payload.js";
import { is_delegate_action } from "./is_delegate_action.js";
import type { ACTION } from "../types/tx/ACTION.js";
import type { DELEGATE_ACTION_BODY } from "../types/tx/DELEGATE_ACTION_BODY.js";

export function get_delegate_body(action: ACTION): DELEGATE_ACTION_BODY | null {
  if (!is_delegate_action(action)) return null;

  const payload = get_action_payload(action);
  if (payload === null) return null;

  const body = payload["delegate_action"];
  if (typeof body !== "object" || body === null) return null;

  const record = body as Record<string, unknown>;
  const actions = Array.isArray(record["actions"])
    ? (record["actions"] as ACTION[])
    : [];

  return {
    sender_id:
      typeof record["sender_id"] === "string" ? record["sender_id"] : "",
    receiver_id:
      typeof record["receiver_id"] === "string" ? record["receiver_id"] : "",
    actions,
    nonce: typeof record["nonce"] === "number" ? record["nonce"] : 0,
    max_block_height:
      typeof record["max_block_height"] === "number"
        ? record["max_block_height"]
        : 0,
    public_key:
      typeof record["public_key"] === "string" ? record["public_key"] : "",
  };
}
// ========================================
// copyright 2026 by sleet.near
