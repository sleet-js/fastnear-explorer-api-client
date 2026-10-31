// ========================================
// PARSE_RESULT
// what parse_transaction returns.
//
// `transfers` holds the built-in fungible transfers. `custom_transfers`
// holds whatever consumer plugins reported. they are kept apart so a
// consumer's own transfers never get mistaken for protocol ones.
//
// `raw` is the untouched transaction, so nothing is ever lost.
// ========================================

import type { CUSTOM_TRANSFER } from "./CUSTOM_TRANSFER";
import type { NFT_TRANSFER_INFO } from "./NFT_TRANSFER_INFO";
import type { PARSED_ACTION } from "./PARSED_ACTION";
import type { RECEIPT_WITH_OUTCOME } from "../tx/RECEIPT_WITH_OUTCOME";
import type { TRANSACTION_DETAIL } from "../tx/TRANSACTION_DETAIL";
import type { TRANSFER_INFO } from "./TRANSFER_INFO";

export interface PARSE_RESULT {
  hash: string;
  signer_id: string;
  receiver_id: string;
  public_key?: string;
  relayer_id: string | null;
  is_delegated: boolean;
  block_height: number;
  timestamp: string;
  gas_burnt: number;
  is_success: boolean | null;
  actions: PARSED_ACTION[];
  transfers: TRANSFER_INFO[];
  nft_transfers: NFT_TRANSFER_INFO[];
  custom_transfers: CUSTOM_TRANSFER[];
  receipts: RECEIPT_WITH_OUTCOME[];
  raw: TRANSACTION_DETAIL;
}
// ========================================
// copyright 2026 by sleet.near
