// ========================================
// PUBLIC_KEY_LOOKUP_RESPONSE
// what a public key lookup answered with.
//
// `account_ids` holds every account that registered the key.
//
// the plain lookup answers with full-access accounts only. the
// `/all` lookup adds the accounts that hold it as a limited
// (function-call) access key.
// ========================================

export interface PUBLIC_KEY_LOOKUP_RESPONSE {
  public_key: string;
  account_ids: string[];
}
// ========================================
// copyright 2026 by sleet.near
