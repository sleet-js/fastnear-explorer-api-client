// ========================================
// TIME_AGO
// a nanosecond timestamp as "5s ago".
//
// the api reports block timestamps in nanoseconds as a STRING.
// a number is accepted too, since a receipt's block_timestamp is a
// number.
// ========================================

export function time_ago(timestamp: string | number): string {
  const nanos = typeof timestamp === "string" ? Number(timestamp) : timestamp;
  if (!Number.isFinite(nanos)) return "";

  const seconds = Math.floor((Date.now() - nanos / 1e6) / 1000);
  if (seconds < 0) return "now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}
// ========================================
// copyright 2026 by sleet.near
