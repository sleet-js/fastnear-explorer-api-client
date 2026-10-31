// ========================================
// THROTTLE
// bin primitive that pauses between calls.
//
// the fastnear api rate limits, and the corpus bins make a lot of
// calls in a row. a small wait between them keeps the api happy.
//
// this is a bin helper, not part of the package.
// ========================================

export function throttle(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// ========================================
// copyright 2026 by sleet.near
