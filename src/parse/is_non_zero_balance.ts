// ========================================
// IS_NON_ZERO_BALANCE
// does this token hold anything?
//
// an account overview lists every token it has ever touched, most of
// them with a zero balance. this is the check that filters those
// out.
//
// a balance of "" and a balance of "0" both mean nothing is held.
// the balance is a decimal string, so it is compared as a string and
// never as a number.
// ========================================

export function is_non_zero_balance(balance: string | undefined | null): boolean {
  if (balance === undefined || balance === null) return false;
  const trimmed = balance.trim();
  if (trimmed.length === 0) return false;
  return trimmed !== "0";
}
// ========================================
// copyright 2026 by sleet.near
