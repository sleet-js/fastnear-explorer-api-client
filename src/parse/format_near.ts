// ========================================
// FORMAT_NEAR
// a yoctoNEAR amount as a readable NEAR amount.
//
// `amount` is a decimal string of yoctoNEAR — it does NOT fit in a
// js number, so this works on the string and never converts it to a
// number.
//
// the result keeps five decimal places, which is what the near
// tooling shows.
//
// the unit is NOT appended — the caller decides whether it wants
// "1.5" or "1.5 NEAR". use format_near_with_unit for that.
//
// a tiny amount keeps its own unit: 1 yoctoNEAR is not "0" and
// rounding it away would lose the only value it has.
// ========================================

const YOCTO_DIGITS = 24;

export function format_near(amount: string | undefined | null): string {
  if (amount === undefined || amount === null) return "0";
  if (amount === "0") return "0";
  if (amount === "1") return "1 yocto";

  const negative = amount.startsWith("-");
  const digits = negative ? amount.slice(1) : amount;

  const padded = digits.padStart(YOCTO_DIGITS + 1, "0");
  const whole = padded.slice(0, padded.length - YOCTO_DIGITS).replace(/^0+/, "");
  const fraction = padded.slice(padded.length - YOCTO_DIGITS).replace(/0+$/, "");

  const whole_part = whole === "" ? "0" : whole;
  const sign = negative ? "-" : "";

  if (fraction === "") return `${sign}${whole_part}`;
  return `${sign}${whole_part}.${fraction.slice(0, 5)}`;
}
// ========================================
// copyright 2026 by sleet.near
