// ========================================
// EVENT_DATA
// one entry of an event's `data`.
//
// the protocol does not constrain the shape — entries are usually
// objects but can be strings, numbers or booleans.
// ========================================

export type EVENT_DATA =
  | {
      old_owner_id?: string;
      new_owner_id?: string;
      owner_id?: string;
      token_ids?: string[];
      amounts?: string[];
      amount?: string;
      memo?: string;
      [key: string]: unknown;
    }
  | string
  | number
  | boolean
  | null
  | unknown[];
// ========================================
// copyright 2026 by sleet.near
