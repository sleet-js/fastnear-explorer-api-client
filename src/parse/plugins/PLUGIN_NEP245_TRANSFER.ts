// ========================================
// PLUGIN_NEP245_TRANSFER
// the built-in plugin for NEP-245 multi token events.
//
// the events are:
//   mt_transfer — old_owner_id -> new_owner_id
//   mt_mint     — owner_id, no old owner
//   mt_burn     — owner_id, no new owner
//
// a multi token event carries PARALLEL arrays — `token_ids[]` and
// `amounts[]` — so one event can move several tokens at once. each
// token_id lines up with the amount at the same index.
//
// the token_id may carry a `nep141:` or `nep245:` prefix, meaning
// the id refers to a token in ANOTHER contract. that prefix is kept
// on the transfer so a ui can tell them apart.
// ========================================

import { is_event_data_object } from "../is_event_data_object";
import { normalize_event_data } from "../normalize_event_data";
import { normalize_owner } from "../normalize_owner";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT";
import type { TRANSFER_INFO } from "../../types/shared/TRANSFER_INFO";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER";

export const plugin_nep245_transfer: TRANSFER_PARSER = {
  id: "builtin.nep245-transfer",
  priority: 300,
  claims: ["nep245"],

  parse_event(
    event,
    context: PARSER_CONTEXT,
    contract_id: string,
  ): TRANSFER_INFO[] {
    if (event.standard !== "nep245") return [];

    const transfers: TRANSFER_INFO[] = [];

    for (const datum of normalize_event_data(event)) {
      if (!is_event_data_object(datum)) continue;

      const token_ids = read_string_array(datum["token_ids"]);
      const amounts = read_string_array(datum["amounts"]);

      const name = event.event;
      const from = normalize_owner(datum["old_owner_id"]);
      const to = normalize_owner(datum["new_owner_id"]);
      const owner = normalize_owner(datum["owner_id"]);

      for (let index = 0; index < token_ids.length; index++) {
        const amount = amounts[index];
        if (amount === undefined || amount === "0") continue;

        const token_id = token_ids[index] as string;

        if (name === "mt_transfer") {
          transfers.push({
            from: from ?? "",
            to: to ?? "",
            amount,
            token_type: "nep245",
            contract_id,
            token_id,
          });
          continue;
        }

        if (name === "mt_mint") {
          transfers.push({
            from: null,
            to: owner ?? "",
            amount,
            token_type: "nep245",
            contract_id,
            token_id,
          });
          continue;
        }

        if (name === "mt_burn") {
          transfers.push({
            from: owner ?? "",
            to: null,
            amount,
            token_type: "nep245",
            contract_id,
            token_id,
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
// ========================================
// copyright 2026 by sleet.near
