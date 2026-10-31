// ========================================
// PARSE_PUBLIC_KEY
// split a "{curve}:{base58}" public key.
//
// the curve is taken as everything before the first colon. a key
// with no colon is all data and no curve.
//
// `is_post_quantum` is true for the ml-dsa curves — the post-quantum
// ones. those payloads are thousands of characters long, so a ui
// wants to know to truncate them.
//
// the curve list is not closed on purpose: the protocol adds curves,
// and a new one must not break the parse.
// ========================================

import type { PARSED_PUBLIC_KEY } from "../types/PARSED_PUBLIC_KEY";

export function parse_public_key(public_key: string): PARSED_PUBLIC_KEY {
  const index = public_key.indexOf(":");

  const curve = index === -1 ? "" : public_key.slice(0, index);
  const data = index === -1 ? public_key : public_key.slice(index + 1);

  return {
    curve,
    data,
    is_post_quantum: curve.toLowerCase().startsWith("ml-dsa"),
  };
}
// ========================================
// copyright 2026 by sleet.near
