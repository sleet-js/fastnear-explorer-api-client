// ========================================
// ADD_KEY_ACTION
// adds an access key to an account.
//
// the public key is "{curve}:{base58}" — see PARSED_PUBLIC_KEY.
// ========================================

import type { ACCESS_KEY } from "./ACCESS_KEY.js";

export interface ADD_KEY_ACTION {
  public_key: string;
  access_key: ACCESS_KEY;
}
// ========================================
// copyright 2026 by sleet.near
