// ========================================
// PLUGIN_NEAR_TRANSFER
// the built-in plugin for native NEAR transfers.
//
// a native transfer is a `Transfer` action on the transaction (or on
// the delegate body). there is no event for it — the action IS the
// transfer.
//
// the amount is the `deposit`, a decimal string of yoctoNEAR. a
// deposit of "0" is not a transfer, so it is skipped.
// ========================================

import { get_action_payload } from "../get_action_payload";
import { get_action_type } from "../get_action_type";
import type { PARSER_CONTEXT } from "../../types/PARSER_CONTEXT";
import type { TRANSFER_INFO } from "../../types/TRANSFER_INFO";
import type { TRANSFER_PARSER } from "../../types/TRANSFER_PARSER";

export const plugin_near_transfer: TRANSFER_PARSER = {
  id: "builtin.near-transfer",
  priority: 100,
  claims: ["near"],

  parse_transfers(context: PARSER_CONTEXT): TRANSFER_INFO[] {
    const transfers: TRANSFER_INFO[] = [];

    for (const action of context.actions) {
      if (get_action_type(action) !== "Transfer") continue;

      const payload = get_action_payload(action);
      const deposit = payload?.["deposit"];
      if (typeof deposit !== "string" || deposit === "0") continue;

      transfers.push({
        from: context.signer_id,
        to: context.receiver_id,
        amount: deposit,
        token_type: "near",
      });
    }

    return transfers;
  },
};
// ========================================
// copyright 2026 by sleet.near
