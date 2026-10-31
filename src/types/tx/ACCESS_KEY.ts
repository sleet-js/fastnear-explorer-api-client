// ========================================
// ACCESS_KEY
// one access key on an account.
// ========================================

import type { ACCESS_KEY_PERMISSION } from "./ACCESS_KEY_PERMISSION";

export interface ACCESS_KEY {
  nonce: number;
  permission: ACCESS_KEY_PERMISSION;
}
// ========================================
// copyright 2026 by sleet.near
