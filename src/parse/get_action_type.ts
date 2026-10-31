// ========================================
// GET_ACTION_TYPE
// the name of an action.
//
// an action is either a bare string (the unit variants, currently
// only "CreateAccount") or a single-key object keyed by the action
// name. this reads the name off either shape.
//
// returns null for an action with no readable name.
// ========================================

import type { ACTION } from "../types/ACTION";

export function get_action_type(action: ACTION): string | null {
  if (typeof action === "string") return action;
  if (typeof action !== "object" || action === null) return null;

  const keys = Object.keys(action);
  if (keys.length === 0) return null;
  return keys[0] ?? null;
}
// ========================================
// copyright 2026 by sleet.near
