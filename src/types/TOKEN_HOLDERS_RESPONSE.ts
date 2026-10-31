// ========================================
// TOKEN_HOLDERS_RESPONSE
// what GET /v1/ft/{token_id}/top answered with.
//
// the top holders of a fungible token, biggest balance first.
//
// `balance` is a decimal string of the token's smallest unit — it
// does NOT fit in a js number.
// ========================================

export interface TOKEN_HOLDERS_RESPONSE {
  token_id: string;
  accounts: {
    account_id: string;
    balance: string;
  }[];
}
// ========================================
// copyright 2026 by sleet.near
