// ========================================
// CHECK_LIMIT
// bin primitive that checks a --limit value against the range the
// endpoint accepts, so a too-large limit fails with a usage line
// instead of a raw 400 from the server.
//
// the ranges come from the fastnear api:
//   blocks       1..100   (the api silently caps at 100)
//   account      1..100
//   transactions 1..20    (hard limit on the hash count)
// ========================================

export interface CHECK_LIMIT_RANGE {
  min: number;
  max: number;
}

export function check_limit(
  raw: string | undefined,
  range: CHECK_LIMIT_RANGE,
  flag: string = "--limit",
): number | undefined {
  if (raw === undefined) return undefined;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < range.min || value > range.max) {
    console.error(`${flag} must be an integer ${range.min}..${range.max}`);
    process.exit(1);
  }
  return value;
}
// ========================================
// copyright 2026 by sleet.near
