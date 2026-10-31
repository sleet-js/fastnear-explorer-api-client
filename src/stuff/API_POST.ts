// ========================================
// API_POST
// the single fetch helper every `fun/tx/api_*` wrapper goes through.
//
// every fastnear tx endpoint is a POST with a json body, so one
// helper covers all of them.
//
// the api answers failures with plain text, so the body is read as
// text and handed to create_api_error — that keeps the server's own
// message ("Json deserialize error: missing field `account_id`")
// instead of throwing it away.
//
// every call prints a framed log block — the middleman format. pass
// `quiet: true` to turn it off.
//
// `signal` aborts the request.
// ========================================

import { create_api_error } from "./API_ERROR";
import type { API_CLIENT_CONFIG } from "./API_CLIENT_CONFIG";
import { api_base_url } from "./API_BASE_URL";
import { api_log } from "./API_LOG";
import { api_retry } from "./API_RETRY";
import { TX_ENDPOINT_PATHS, type TX_ENDPOINT_KEY } from "./TX_ENDPOINT_PATHS";

export interface API_POST_PARAMS {
  endpoint: TX_ENDPOINT_KEY;
  body?: Record<string, unknown>;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // the uppercase name of the call, for the log.
  label?: string;
  // turn the log off.
  quiet?: boolean;
  // how many times to try when the api rate limits. 0 turns the
  // retry off.
  retries?: number;
}

export async function api_post<t = unknown>({
  endpoint,
  body = {},
  config = {},
  signal,
  label,
  quiet = false,
  retries = 3,
}: API_POST_PARAMS): Promise<t> {
  const base_url = api_base_url("tx", config);
  const path = TX_ENDPOINT_PATHS[endpoint];
  const url = `${base_url}${path}`;
  const call_label = label ?? `TX ${endpoint.toUpperCase()}`;

  return api_retry(
    async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        const error = create_api_error(
          response.status,
          response.statusText,
          text,
          `${call_label.toLowerCase()} failed`,
        );

        if (!quiet) {
          api_log({
            label: call_label,
            url,
            method: "POST",
            status: response.status,
            status_text: response.statusText,
            error: error.message,
          });
        }

        throw error;
      }

      const json = (await response.json()) as t;

      if (!quiet) {
        api_log({
          label: call_label,
          url,
          method: "POST",
          status: response.status,
          status_text: response.statusText,
          response: json,
        });
      }

      return json;
    },
    { attempts: retries + 1 },
  );
}
// ========================================
// copyright 2026 by sleet.near
