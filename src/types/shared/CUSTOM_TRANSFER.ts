// ========================================
// CUSTOM_TRANSFER
// a transfer reported by a consumer's own plugin.
//
// the shape is deliberately open: a plugin knows things about its
// token that this package does not, so it can put whatever it likes
// in `extra`.
//
// `extra` is REQUIRED and it is the marker. the runtime uses it to
// tell a custom transfer apart from a built-in one, so a transfer
// without it would be filed as a built-in and a consumer's own
// transfer would quietly disappear into the generic list.
// ========================================

export interface CUSTOM_TRANSFER {
  from: string | null;
  to: string | null;
  amount: string;
  token_type: string;
  contract_id?: string;
  token_id?: string;
  memo?: string;
  extra: Record<string, unknown>;
}
// ========================================
// copyright 2026 by sleet.near
