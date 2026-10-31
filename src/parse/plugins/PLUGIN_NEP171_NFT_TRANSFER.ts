// ========================================
// PLUGIN_NEP171_NFT_TRANSFER
// the built-in plugin for NEP-171 nft events.
//
// the events are:
//   nft_transfer — old_owner_id -> new_owner_id
//   nft_mint     — owner_id, no old owner
//   nft_burn     — owner_id, no new owner
//
// an nft event carries a `token_ids[]` array — one event can move
// several tokens at once.
// ========================================

import { is_event_data_object } from "../is_event_data_object.js";
import { normalize_event_data } from "../normalize_event_data.js";
import { normalize_owner } from "../normalize_owner.js";
import type { NFT_TRANSFER_INFO } from "../../types/shared/NFT_TRANSFER_INFO.js";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT.js";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER.js";

export const plugin_nep171_nft_transfer: TRANSFER_PARSER = {
  id: "builtin.nep171-nft-transfer",
  priority: 400,
  claims: ["nep171"],

  parse_event(
    event,
    context: PARSER_CONTEXT,
    contract_id: string,
  ): NFT_TRANSFER_INFO[] {
    if (event.standard !== "nep171") return [];

    const transfers: NFT_TRANSFER_INFO[] = [];

    for (const datum of normalize_event_data(event)) {
      if (!is_event_data_object(datum)) continue;

      const token_ids = read_string_array(datum["token_ids"]);
      const name = event.event;
      const from = normalize_owner(datum["old_owner_id"]);
      const to = normalize_owner(datum["new_owner_id"]);
      const owner = normalize_owner(datum["owner_id"]);

      for (const token_id of token_ids) {
        if (name === "nft_transfer") {
          transfers.push({
            from: from ?? "",
            to: to ?? "",
            contract_id,
            token_id,
            memo: read_memo(datum),
          });
          continue;
        }

        if (name === "nft_mint") {
          transfers.push({
            from: null,
            to: owner ?? "",
            contract_id,
            token_id,
            memo: read_memo(datum),
          });
          continue;
        }

        if (name === "nft_burn") {
          transfers.push({
            from: owner ?? "",
            to: null,
            contract_id,
            token_id,
            memo: read_memo(datum),
          });
        }
      }
    }

    return transfers;
  },
};


function read_string_array(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function read_memo(datum: Record<string, unknown>): string | undefined {
  return typeof datum["memo"] === "string" ? datum["memo"] : undefined;
}
// ========================================
// copyright 2026 by sleet.near
