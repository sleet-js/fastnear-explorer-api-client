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
// in that shape. the details ride ALONG on the action, in `fastfs`
// and `fastfs_url`.
//
// THE PLUGIN ENRICHES THE ACTION. IT DOES NOT ADD ONE.
//
// an earlier version reported a SECOND action, of type `Fastfs`, and
// the transaction then looked like it had done twice what it did. the
// action count is a fact a reader checks, and "2 actions" for one
// call is a lie. so this plugin writes its details onto the action
// that is ALREADY there, and the count stays what the chain
// recorded.
//
// that is what the `enrich_actions` hook is for. `parse_actions`
// APPENDS, and appending is wrong here.
//
// the url's PREDECESSOR is the transaction's SIGNER — the account
// that signed it, which is the receipt's predecessor — and the
// RECEIVER is the action's receiver. they are not the same account
// in general, and the url is wrong if they are swapped.
// ========================================

import { decode_base64_bytes_raw } from "../decode_base64_bytes_raw";
import { fastfs_decode_fun } from "../fastfs/fastfs_decode";
import { fastfs_file_url_fun } from "../fastfs/fastfs_file_url";
import { fastfs_is_call_fun } from "../fastfs/fastfs_is";
import type { PARSER_CONTEXT } from "../../types/shared/PARSER_CONTEXT";
import type { TRANSFER_PARSER } from "../../types/shared/TRANSFER_PARSER";

export const plugin_fastfs: TRANSFER_PARSER = {
  id: "builtin.fastfs",
  // 500 — after every transfer plugin. the built-ins use 100..400.
  priority: 500,

  enrich_actions(context: PARSER_CONTEXT): void {
    for (const action of context.parsed_actions) {
      if (action.type !== "FunctionCall") continue;

      const method_name = action.method_name;
      if (method_name === undefined) continue;
      if (!fastfs_is_call_fun(method_name)) continue;

      const args = action.args;
      if (args === undefined) continue;

      // the raw bytes. NOT `decode_args` — that one decodes to utf-8
      // TEXT and back, which mangles a binary payload: a png is not
      // utf-8, and the bytes must survive the decode untouched.
      const bytes = decode_base64_bytes_raw(args);
      if (bytes === null) continue;

      const info = fastfs_decode_fun(bytes);
      if (info === null) continue;

      // the details go ONTO the action. the type stays `FunctionCall`,
      // because that is what the call was.
      action.fastfs = info;
      action.fastfs_url = fastfs_file_url_fun(
        context.signer_id,
        context.receiver_id,
        info.relative_path,
      );
    }
  },
};
// ========================================
// copyright 2026 by sleet.near
