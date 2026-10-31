// ========================================
// PARSED_PUBLIC_KEY
// a near public key, split into its curve and its payload.
//
// a public key is serialized as "{curve}:{base58}":
//   ed25519:...       the classic curve
//   secp256k1:...     the bitcoin curve
//   ml-dsa-44:...     post-quantum (FIPS-204 / NIST ML-DSA)
//   ml-dsa-65:...
//   ml-dsa-87:...
//
// the curve list is NOT closed — new curves show up as the protocol
// adds them, so `curve` is a plain string.
// ========================================

export interface PARSED_PUBLIC_KEY {
  curve: string;
  data: string;
  is_post_quantum: boolean;
}
// ========================================
// copyright 2026 by sleet.near
