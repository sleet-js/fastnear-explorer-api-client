// ========================================
// API_RECEIPT
// POST /v0/receipt — one receipt, with the transaction that made it.
//
// the receipt body itself is not included: this is the flat row, the
// same shape a block listing carries. to get the full receipt with
// its outcome, look the tx up with api_transactions.
// ========================================

import { api_post } from "../../stuff/API_POST.js";
import type { API_RECEIPT_PARAMS } from "../../types/tx/API_RECEIPT_PARAMS.js";
import type { API_RECEIPT_RESPONSE } from "../../types/tx/API_RECEIPT_RESPONSE.js";

export async function api_receipt(
  params: API_RECEIPT_PARAMS,
): Promise<API_RECEIPT_RESPONSE> {
  const { config, signal, receipt_id, quiet } = params;
  return api_post<API_RECEIPT_RESPONSE>({
    endpoint: "receipt",
    body: { receipt_id },
    config,
    signal,
    quiet,
    label: "TX RECEIPT",
  });
}
// ========================================
// copyright 2026 by sleet.near
