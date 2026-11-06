// ========================================
// DEFAULT_PLUGINS
// the built-in plugin set.
//
// this is the list the default registry is built from. it covers the
// protocol standards this package knows:
//   near   — native NEAR transfers
//   nep141 — fungible tokens
//   nep245 — multi tokens
//   nep171 — nfts
//   plus the delete-account refund sweep
//   and the FastFS uploads, which are not transfers but are reported
//   as parsed actions.
//
// a consumer adds their own by passing plugins to parse_transaction,
// or by building their own registry.
// ========================================

import { plugin_delete_account_transfer } from "./PLUGIN_DELETE_ACCOUNT_TRANSFER";
import { plugin_fastfs } from "./PLUGIN_FASTFS";
import { plugin_near_transfer } from "./PLUGIN_NEAR_TRANSFER";
import { plugin_nep141_transfer } from "./PLUGIN_NEP141_TRANSFER";
import { plugin_nep171_nft_transfer } from "./PLUGIN_NEP171_NFT_TRANSFER";
import { plugin_nep245_transfer } from "./PLUGIN_NEP245_TRANSFER";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER";

export const DEFAULT_PLUGINS: TRANSFER_PARSER[] = [
  plugin_near_transfer,
  plugin_delete_account_transfer,
  plugin_nep141_transfer,
  plugin_nep245_transfer,
  plugin_nep171_nft_transfer,
  plugin_fastfs,
];
// ========================================
// copyright 2026 by sleet.near
