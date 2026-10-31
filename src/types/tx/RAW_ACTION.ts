// ========================================
// RAW_ACTION
// an action as it came off the wire, before it was flattened.
//
// the ACTION union only covers the actions this package knows. the
// protocol may add more, and those still arrive. RAW_ACTION is the
// open shape they come in as.
//
// use get_action_type to read the name of either.
// ========================================

export type RAW_ACTION = string | { [key: string]: unknown };
// ========================================
// copyright 2026 by sleet.near
