// ========================================
// DELEGATE_ACTION
// the delegate wrapper — a signed inner action plus the relayer's
// signature over it.
//
// the transaction signer of a delegate transaction is the RELAYER.
// the economic actor is `delegate_action.sender_id`.
// ========================================

import type { DELEGATE_ACTION_BODY } from "./DELEGATE_ACTION_BODY.js";

export interface DELEGATE_ACTION {
  delegate_action: DELEGATE_ACTION_BODY;
  signature: string;
}
// ========================================
// copyright 2026 by sleet.near
