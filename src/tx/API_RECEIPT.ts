// ========================================
// API_RECEIPT
// POST /v0/receipt — one receipt, with the transaction that made it.
//
// the receipt body itself is not included: this is the flat row, the
// same shape a block listing carries. to get the full receipt with
// its outcome, look the tx up with api_transactions.
// ========================================

import { api_post } from "../stuff/API_POST";
import type { API_RECEIPT_PARAMS } from "../types/API_RECEIPT_PARAMS";
import type { API_RECEIPT_RESPONSE } from "../types/API_RECEIPT_RESPONSE";

export async function api_receipt(
  params: API_RECEIPT_PARAMS,
): Promise<API_RECEIPT_RESPONSE> {
  const { config, signal, receipt_id } = params;
  return api_post<API_RECEIPT_RESPONSE>({
    endpoint: "receipt",
    body: { receipt_id },
    config,
    signal,
    label: "api_receipt failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
