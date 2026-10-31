// ========================================
// PLUGIN_DELETE_ACCOUNT_TRANSFER
// the built-in plugin for the refund a deleted account gets.
//
// when an account is deleted, the protocol sweeps its remaining
// balance to the beneficiary. that sweep is a `system` receipt
// running a `Transfer` action to the beneficiary.
//
// so the transfer is found by looking for the system receipt whose
// receiver is the beneficiary.
// ========================================

import { get_action_payload } from "../get_action_payload";
import { get_action_type } from "../get_action_type";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT";
import type { TRANSFER_INFO } from "../../types/shared/TRANSFER_INFO";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER";

export const plugin_delete_account_transfer: TRANSFER_PARSER = {
  id: "builtin.delete-account-transfer",
  priority: 150,

  parse_transfers(context: PARSER_CONTEXT): TRANSFER_INFO[] {
    const transfers: TRANSFER_INFO[] = [];

    for (const action of context.actions) {
      if (get_action_type(action) !== "DeleteAccount") continue;

      const payload = get_action_payload(action);
      const beneficiary = payload?.["beneficiary_id"];
      if (typeof beneficiary !== "string" || beneficiary === "") continue;

      for (const receipt of context.tx.receipts) {
        const inner = receipt.receipt.receipt;
        if (!("Action" in inner)) continue;

        // the refund comes from the system, not from the account.
        if (receipt.receipt.predecessor_id !== "system") continue;
        if (receipt.receipt.receiver_id !== beneficiary) continue;

        for (const receipt_action of inner.Action.actions) {
          if (get_action_type(receipt_action) !== "Transfer") continue;

          const receipt_payload = get_action_payload(receipt_action);
          const deposit = receipt_payload?.["deposit"];
          if (typeof deposit !== "string" || deposit === "0") continue;

          transfers.push({
            from: context.receiver_id,
            to: beneficiary,
            amount: deposit,
            token_type: "near",
          });
        }
      }
    }

    return transfers;
  },
};
// ========================================
// copyright 2026 by sleet.near
