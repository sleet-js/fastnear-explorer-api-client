// ========================================
// FORMAT_TOKEN_AMOUNT
// a raw token amount as a readable amount.
//
// `amount` is the raw integer in the token's smallest unit and
// `decimals` says how many of those there are in one token.
//
// like format_near this works on the string, never on a number —
// token amounts overflow a js number.
// ========================================

export function format_token_amount(
  amount: string | undefined | null,
  decimals: number,
): string {
  if (amount === undefined || amount === null) return "0";
  if (amount === "0") return "0";
  if (decimals <= 0) return amount;

  const negative = amount.startsWith("-");
  const digits = negative ? amount.slice(1) : amount;

  const padded = digits.padStart(decimals + 1, "0");
  const whole = padded.slice(0, padded.length - decimals).replace(/^0+/, "");
  const fraction = padded.slice(padded.length - decimals).replace(/0+$/, "");
  const sign = negative ? "-" : "";

  if (fraction === "") return `${sign}${whole === "" ? "0" : whole}`;
  return `${sign}${whole === "" ? "0" : whole}.${fraction.slice(0, 5)}`;
}
// ========================================
// copyright 2026 by sleet.near
