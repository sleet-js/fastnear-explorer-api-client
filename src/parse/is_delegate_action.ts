// ========================================
// IS_DELEGATE_ACTION
// is this action a delegate?
//
// a delegate is the only action that carries a delegate_action body.
// the check is on the payload, not on the name, so it stays correct
// if the protocol adds another wrapping action.
// ========================================

import { get_action_payload } from "./get_action_payload";
import { get_action_type } from "./get_action_type";
import type { ACTION } from "../types/tx/ACTION";

export function is_delegate_action(action: ACTION): boolean {
  if (get_action_type(action) !== "Delegate") return false;
  const payload = get_action_payload(action);
  if (payload === null) return false;
  return (
    typeof payload["delegate_action"] === "object" &&
    payload["delegate_action"] !== null
  );
}
// ========================================
// copyright 2026 by sleet.near
