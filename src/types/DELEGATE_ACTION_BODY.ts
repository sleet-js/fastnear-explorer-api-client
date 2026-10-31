// ========================================
// DELEGATE_ACTION_BODY
// the signed action a relayer submits on someone else's behalf.
//
// `actions` holds the real (inner) actions. they are serialized in
// the same enveloped form as top-level actions — `{ "FunctionCall":
// {...} }` — NOT the flat `{ type: "FunctionCall" }` form.
// ========================================

import type { ACTION } from "./ACTION";

export interface DELEGATE_ACTION_BODY {
  sender_id: string;
  receiver_id: string;
  actions: ACTION[];
  nonce: number;
  max_block_height: number;
  public_key: string;
}
// ========================================
// copyright 2026 by sleet.near
