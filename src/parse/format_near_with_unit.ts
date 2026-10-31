// ========================================
// FORMAT_NEAR_WITH_UNIT
// a yoctoNEAR amount as a readable NEAR amount, with the unit.
//
//   format_near_with_unit("1000000000000000000000000")  ->  "1 NEAR"
//   format_near_with_unit("1")                          ->  "1 yocto"
//
// this is format_near plus " NEAR", except for the yocto case —
// a single yocto is shown as "1 yocto", never as "0 NEAR".
// ========================================

import { format_near } from "./format_near";

export function format_near_with_unit(
  amount: string | undefined | null,
): string {
  if (amount === undefined || amount === null) return "0 NEAR";
  if (amount === "1") return "1 yocto";
  return `${format_near(amount)} NEAR`;
}
// ========================================
// copyright 2026 by sleet.near
