// ========================================
// TRANSFER_INFO
// one fungible transfer.
//
// `from` is null for a MINT, `to` is null for a BURN. the api
// encodes "no owner" as an empty string in some event logs, so the
// parser normalizes that to null.
//
// `token_id` is the raw id within a nep245 contract. it may carry a
// `nep141:` or `nep245:` prefix, which means the id refers to
// another contract's token.
// ========================================

import type { TOKEN_TYPE } from "./TOKEN_TYPE";

export interface TRANSFER_INFO {
  from: string | null;
  to: string | null;
  amount: string;
  token_type: TOKEN_TYPE;
  contract_id?: string;
  token_id?: string;
  memo?: string;
}
// ========================================
// copyright 2026 by sleet.near
