// ========================================
// ARGS_VIEW_MODES
// the views that are possible for a decoded argument.
//
// the json view is only there when the payload IS json. the other
// three are always possible.
//
// base64 is never the default — it is the input, so showing it back
// adds nothing. it is still a valid view.
// ========================================

import type { ARGS_VIEW_MODE } from "../types/shared/ARGS_VIEW_MODE";

export function args_view_modes(has_json: boolean): ARGS_VIEW_MODE[] {
  const modes: ARGS_VIEW_MODE[] = [];
  if (has_json) modes.push("json");
  modes.push("raw", "hex", "base64");
  return modes;
}
// ========================================
// copyright 2026 by sleet.near
