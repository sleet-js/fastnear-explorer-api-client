// ========================================
// PARSED_ACTION
// one action, flattened for rendering.
//
// the raw action is a nested single-key object; this is the flat
// shape a ui can switch on. `type` says which action it was.
//
// `type: "Unknown"` covers an action name this package does not
// know — the raw action is still in `raw` so nothing is lost.
//
// A PROTOCOL WITH ITS OWN SHAPE GETS ITS OWN OPTIONAL FIELDS.
//
// FastFS is the one today: its payload is a borsh blob, and the
// details of a file do not fit in the generic fields above. so a
// FastFS call — a `FunctionCall` — carries `fastfs` and `fastfs_url`
// beside them. both are optional, so a consumer that ignores them is
// unaffected.
//
// --- WHY THE TYPE IS NOT CHANGED: the action IS a function call. the
// details are extra facts about it, not a different kind of action. a
// consumer that switches on `type` sees exactly what it saw before,
// and the action count is the count the chain recorded.
// ========================================

import type { RAW_ACTION } from "../tx/RAW_ACTION";
import type { DECODED_ARGS } from "./DECODED_ARGS";
import type { FASTFS_FILE_INFO } from "./FASTFS_FILE_INFO";

export interface PARSED_ACTION {
  type: string;
  method_name?: string;
  deposit?: string;
  args?: string;
  /** the decoded form of `args`, ready to render. */
  args_decoded?: DECODED_ARGS;
  gas?: number;
  public_key?: string;
  access_key_permission?: string;
  beneficiary_id?: string;
  code_hash?: string;
  stake?: string;
  code_hash_base58?: string;
  /**
   * the decoded FastFS upload, for a `__fastdata_fastfs` call.
   *
   * OPTIONAL, and that matters: the FastFS payload is a borsh blob
   * and the details of a file do not fit in the generic fields above.
   * a consumer that switches on `type` and ignores this field sees
   * exactly what it saw before.
   */
  fastfs?: FASTFS_FILE_INFO;
  /**
   * where the FastFS file is served from, for a `__fastdata_fastfs`
   * call.
   *
   * it lives beside `fastfs` and not inside it, because the url is
   * NOT part of the decoded payload — it is built from the
   * transaction's signer and the receiver, which the payload does
   * not carry.
   */
  fastfs_url?: string;
  raw: RAW_ACTION;
}
// ========================================
// copyright 2026 by sleet.near
