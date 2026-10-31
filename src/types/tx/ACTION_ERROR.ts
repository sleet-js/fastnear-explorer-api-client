// ========================================
// ACTION_ERROR
// the failure of a single action.
//
// `index` points at the action that failed inside the transaction.
// it is null when the failure is not tied to one action.
// ========================================

import type { ERROR_KIND } from "./ERROR_KIND.js";

export interface ACTION_ERROR {
  index: number | null;
  kind: ERROR_KIND;
}
// ========================================
// copyright 2026 by sleet.near
