// ========================================
// PLUGIN_NEP141_TRANSFER
// the built-in plugin for NEP-141 fungible token events.
//
// the events are:
//   ft_transfer — old_owner_id -> new_owner_id
//   ft_mint     — owner_id, no old owner
//   ft_burn     — owner_id, no new owner
//
// the token contract is the receipt's receiver_id — that is the
// contract that ran and emitted the event.
// ========================================

import { is_event_data_object } from "../is_event_data_object.js";
import { normalize_event_data } from "../normalize_event_data.js";
import { normalize_owner } from "../normalize_owner.js";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT.js";
import type { TRANSFER_INFO } from "../../types/shared/TRANSFER_INFO.js";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER.js";

export const plugin_nep141_transfer: TRANSFER_PARSER = {
  id: "builtin.nep141-transfer",
  priority: 200,
  claims: ["nep141"],

  parse_event(
    event,
    context: PARSER_CONTEXT,
    contract_id: string,
  ): TRANSFER_INFO[] {
    if (event.standard !== "nep141") return [];

    const transfers: TRANSFER_INFO[] = [];

    for (const datum of normalize_event_data(event)) {
      if (!is_event_data_object(datum)) continue;

      const amount = datum["amount"];
      if (typeof amount !== "string" || amount === "0") continue;

      const name = event.event;
      const from = normalize_owner(datum["old_owner_id"]);
      const to = normalize_owner(datum["new_owner_id"]);
      const owner = normalize_owner(datum["owner_id"]);

      if (name === "ft_transfer") {
        transfers.push({
          from: from ?? "",
          to: to ?? "",
          amount,
          token_type: "nep141",
          contract_id,
          memo: read_memo(datum),
        });
        continue;
      }

      if (name === "ft_mint") {
        transfers.push({
          from: null,
          to: owner ?? "",
          amount,
          token_type: "nep141",
          contract_id,
          memo: read_memo(datum),
        });
        continue;
      }

      if (name === "ft_burn") {
        transfers.push({
          from: owner ?? "",
          to: null,
          amount,
          token_type: "nep141",
          contract_id,
          memo: read_memo(datum),
        });
      }
    }

    return transfers;
  },
};

function read_memo(datum: Record<string, unknown>): string | undefined {
  return typeof datum["memo"] === "string" ? datum["memo"] : undefined;
}
// ========================================
// copyright 2026 by sleet.near
