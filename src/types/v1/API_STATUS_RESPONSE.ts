// ========================================
// API_STATUS_RESPONSE
// what GET /status answered with.
//
// this is how far the indexer has got, and how far behind it is.
//
// `sync_block_height` is the height the indexer has indexed.
// `sync_latency_sec` is how far behind the chain head it is.
// `sync_balance_block_height` is the height the BALANCES are
// indexed to — balances lag the blocks.
//
// the timestamp is a nanosecond STRING.
// ========================================

export interface API_STATUS_RESPONSE {
  version: string;
  sync_block_height: number | null;
  sync_latency_sec: number | null;
  sync_block_timestamp_nanosec: string | null;
  sync_balance_block_height: number | null;
}
// ========================================
// copyright 2026 by sleet.near
