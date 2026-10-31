// ========================================
// FORMAT_GAS
// a gas amount as Tgas.
//
// the api reports gas in units of 1e12, so Tgas is the value divided
// by 1e12.
// ========================================

const GAS_PER_TGAS = 1e12;

export function format_gas(gas: number | undefined | null): string {
  if (gas === undefined || gas === null) return "0.00 Tgas";
  return `${(gas / GAS_PER_TGAS).toFixed(2)} Tgas`;
}
// ========================================
// copyright 2026 by sleet.near
