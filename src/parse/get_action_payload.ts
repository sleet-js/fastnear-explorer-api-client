// ========================================
// GET_ACTION_PAYLOAD
// the body of an action.
//
// for an enveloped action (`{ "Transfer": {...} }`) that is the
// object under the name. for a bare string action there is no body,
// so null comes back.
//
// the payload is returned as a plain record so the action-specific
// readers can pick the fields they need without the caller having
// to narrow the union by hand.
// ========================================

import { get_action_type } from "./get_action_type";
import type { ACTION } from "../types/ACTION";

export function get_action_payload(
  action: ACTION,
): Record<string, unknown> | null {
  if (typeof action === "string") return null;
  if (typeof action !== "object" || action === null) return null;

  const type = get_action_type(action);
  if (type === null) return null;

  const payload = (action as Record<string, unknown>)[type];
  if (typeof payload !== "object" || payload === null) return null;
  return payload as Record<string, unknown>;
}
// ========================================
// copyright 2026 by sleet.near
