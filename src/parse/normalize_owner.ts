// ========================================
// NORMALIZE_OWNER
// the owner id of a transfer event.
//
// a mint has no old owner and a burn has no new owner. the api
// signals that in two ways depending on the contract:
//   - the key is simply missing
//   - the key is present but holds an EMPTY STRING
//
// both mean "nobody", so both come back as null. null is what a ui
// checks to draw the Mint / Burn badge.
//
// an empty string is never a real account id, so this cannot
// mistake a real owner for a missing one.
// ========================================

export function normalize_owner(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed;
}
// ========================================
// copyright 2026 by sleet.near
