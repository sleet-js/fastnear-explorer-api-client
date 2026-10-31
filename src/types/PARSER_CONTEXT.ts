// ========================================
// PARSER_CONTEXT
// what every parser plugin is handed.
//
// the context already accounts for delegate actions: for a relayed
// transaction `signer_id` / `receiver_id` / `actions` are the
// DELEGATED ones — the real economic actor — while `relayer_id`
// holds the outer signer who paid the gas.
//
// `tx` is the raw transaction, for plugins that need anything this
// package does not model.
// ========================================

import type { ACTION } from "./ACTION";
import type { TRANSACTION_DETAIL } from "./TRANSACTION_DETAIL";

export interface PARSER_CONTEXT {
  signer_id: string;
  receiver_id: string;
  relayer_id: string | null;
  is_delegated: boolean;
  actions: ACTION[];
  tx: TRANSACTION_DETAIL;
}
// ========================================
// copyright 2026 by sleet.near
