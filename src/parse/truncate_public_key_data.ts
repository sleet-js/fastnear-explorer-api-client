// ========================================
// TRUNCATE_PUBLIC_KEY_DATA
// shorten a public key payload for display.
//
// the post-quantum payloads are thousands of characters, so a head
// and tail preview keeps a row readable. the full key stays
// available through a copy or a tooltip.
// ========================================

export function truncate_public_key_data(
  data: string,
  head = 8,
  tail = 6,
): string {
  if (data.length <= head + tail + 1) return data;
  return `${data.slice(0, head)}…${data.slice(-tail)}`;
}
// ========================================
// copyright 2026 by sleet.near
