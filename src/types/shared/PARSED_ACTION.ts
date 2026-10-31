// ========================================
// PARSED_ACTION
// one action, flattened for rendering.
//
// the raw action is a nested single-key object; this is the flat
// shape a ui can switch on. `type` says which action it was.
//
// `type: "Unknown"` covers an action name this package does not
// know — the raw action is still in `raw` so nothing is lost.
// ========================================

import type { RAW_ACTION } from "../tx/RAW_ACTION.js";

export interface PARSED_ACTION {
  type: string;
  method_name?: string;
  deposit?: string;
  args?: string;
  gas?: number;
  public_key?: string;
  access_key_permission?: string;
  beneficiary_id?: string;
  code_hash?: string;
  stake?: string;
  code_hash_base58?: string;
  raw: RAW_ACTION;
}
// ========================================
// copyright 2026 by sleet.near
