// ========================================
// NFT_TRANSFER_INFO
// one non-fungible token transfer.
//
// `from` is null for a MINT, `to` is null for a BURN.
// ========================================

export interface NFT_TRANSFER_INFO {
  from: string | null;
  to: string | null;
  contract_id: string;
  token_id: string;
  memo?: string;
}
// ========================================
// copyright 2026 by sleet.near
