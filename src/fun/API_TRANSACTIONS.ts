// ========================================
// API_TRANSACTIONS
// POST /v0/transactions — full transactions, by hash.
//
// the api takes at most 20 hashes per call and answers with fewer
// transactions than asked for when a hash is unknown.
//
// this is the endpoint that returns the nested shape — actions,
// receipts, outcomes — everything the parser needs.
// ========================================

import { api_post } from "../stuff/API_POST";
import type { API_TRANSACTIONS_PARAMS } from "../types/API_TRANSACTIONS_PARAMS";
import type { API_TRANSACTIONS_RESPONSE } from "../types/API_TRANSACTIONS_RESPONSE";

export const TRANSACTIONS_BATCH_SIZE = 20;

export async function api_transactions(
  params: API_TRANSACTIONS_PARAMS,
): Promise<API_TRANSACTIONS_RESPONSE> {
  const { config, signal, tx_hashes } = params;
  if (tx_hashes.length > TRANSACTIONS_BATCH_SIZE) {
    throw new Error(
      `api_transactions takes at most ${TRANSACTIONS_BATCH_SIZE} hashes per call, got ${tx_hashes.length}`,
    );
  }
  return api_post<API_TRANSACTIONS_RESPONSE>({
    endpoint: "transactions",
    body: { tx_hashes },
    config,
    signal,
    label: "api_transactions failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
