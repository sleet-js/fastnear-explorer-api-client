// ========================================
// COLLECT_EVENTS
// every event in a transaction, with the contract that emitted it.
//
// walks the receipts once and picks out the EVENT_JSON logs. the
// contract id matters: a nep141 event's contract is the token
// contract, because that is where the token lives.
//
// the receipt's receiver_id is the contract that ran — for a token
// transfer that is the token contract.
// ========================================

import { parse_event_json } from "./parse_event_json";
import type { COLLECTED_EVENT } from "../types/shared/COLLECTED_EVENT";
import type { TRANSACTION_DETAIL } from "../types/tx/TRANSACTION_DETAIL";

export function collect_events(tx: TRANSACTION_DETAIL): COLLECTED_EVENT[] {
  const collected: COLLECTED_EVENT[] = [];

  for (const receipt of tx.receipts) {
    const contract_id = receipt.receipt.receiver_id;
    const logs = receipt.execution_outcome.outcome.logs;

    for (const log of logs) {
      const event = parse_event_json(log);
      if (event === null) continue;
      collected.push({
        event,
        contract_id,
        receipt_id: receipt.receipt.receipt_id,
      });
    }
  }

  return collected;
}
// ========================================
// copyright 2026 by sleet.near
