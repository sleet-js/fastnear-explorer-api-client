// ========================================
// PLUGIN_FASTFS
// the built-in plugin for FastFS uploads.
//
// a FastFS upload is a function call to `__fastdata_fastfs` whose
// arguments are RAW BORSH BYTES, not json:
//
//   enum FastfsData {
//       Simple(SimpleFastfs),    // variant 0
//       Partial(PartialFastfs),  // variant 1
//   }
//
// the receiver is ANY account — `fastfs.near` is the convention and
// the namespace everyone uses, and there is no contract on it. so
// the METHOD NAME is the only thing that identifies the call.
//
// THE RECEIPT FAILS WITH `CodeDoesNotExist` — by design. the receiver
// has no contract and does not need one; the indexer reads the
// transaction, not the receipt. so a failed receipt on a FastFS call
// is the expected outcome, not a failure.
//
// THIS IS A PLUGIN, NOT A CHANGE TO `parse_action`.
//
// `parse_action` flattens ONE action into a generic shape, and the
// FastFS details — the file, the url, the preview kind — do not fit
// in that shape. the `parse_actions` hook exists for exactly this: a
// protocol's own parsed form, reported beside the generic one.
//
// the action is reported with `type: "Fastfs"` and the details
// carried alongside in `fastfs` and `fastfs_url`.
//
// the url's PREDECESSOR is the transaction's SIGNER — the account
// that signed it, which is the receipt's predecessor — and the
// RECEIVER is the action's receiver. they are not the same account
// in general, and the url is wrong if they are swapped.
// ========================================

import { decode_base64_bytes_raw } from "../decode_base64_bytes_raw";
import { get_action_payload } from "../get_action_payload";
import { get_action_type } from "../get_action_type";
import { fastfs_decode_fun } from "../fastfs/fastfs_decode";
import { fastfs_file_url_fun } from "../fastfs/fastfs_file_url";
import { fastfs_is_call_fun } from "../fastfs/fastfs_is";
import type { PARSED_ACTION } from "../../types/shared/PARSED_ACTION";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER";

export const plugin_fastfs: TRANSFER_PARSER = {
  id: "builtin.fastfs",
  // 500 — after every transfer plugin. the built-ins use 100..400.
  priority: 500,

  parse_actions(context: PARSER_CONTEXT): PARSED_ACTION[] {
    const actions: PARSED_ACTION[] = [];

    for (const action of context.actions) {
      if (get_action_type(action) !== "FunctionCall") continue;

      const payload = get_action_payload(action);
      const method_name = payload?.["method_name"];
      if (typeof method_name !== "string") continue;
      if (!fastfs_is_call_fun(method_name)) continue;

      const args = payload?.["args"];
      if (typeof args !== "string") continue;

      // the raw bytes. NOT `decode_args` — that one decodes to utf-8
      // TEXT and back, which mangles a binary payload: a png is not
      // utf-8, and the bytes must survive the decode untouched.
      const bytes = decode_base64_bytes_raw(args);
      if (bytes === null) continue;

      const info = fastfs_decode_fun(bytes);
      if (info === null) continue;

      actions.push({
        type: "Fastfs",
        method_name,
        args,
        fastfs: info,
        fastfs_url: fastfs_file_url_fun(
          context.signer_id,
          context.receiver_id,
          info.relative_path,
        ),
        raw: action,
      });
    }

    return actions;
  },
};
// ========================================
// copyright 2026 by sleet.near
