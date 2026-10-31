// ========================================
// COLLECTED_EVENT
// one event, with the contract that emitted it.
//
// the contract id matters: a nep141 event's contract is the token
// contract, because that is where the token lives.
//
// `receipt_id` says which receipt the event came from.
// ========================================

import type { EVENT_JSON } from "../types/EVENT_JSON";

export interface COLLECTED_EVENT {
  event: EVENT_JSON;
  contract_id: string;
  receipt_id: string;
}
// ========================================
// copyright 2026 by sleet.near
