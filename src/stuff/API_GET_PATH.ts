// ========================================
// API_GET_PATH
// the fetch helper for the v1 api.
//
// the v1 api is GET-only and its parameters go in the path, so the
// path template is filled in here.
//
// a template looks like "/v1/account/{account_id}/full" and the
// values are named after the placeholders. a value that is not in
// the map is an error — a half-filled path would silently hit the
// wrong endpoint.
//
// every call prints a framed log block — the middleman format. pass
// `quiet: true` to turn it off.
// ========================================

import { create_api_error } from "./API_ERROR";
import type { API_CLIENT_CONFIG } from "./API_CLIENT_CONFIG";
import { api_base_url } from "./API_BASE_URL";
import { api_log } from "./API_LOG";
import { api_retry } from "./API_RETRY";
import { V1_ENDPOINT_PATHS, type V1_ENDPOINT_KEY } from "./V1_ENDPOINT_PATHS";

export interface API_GET_PATH_PARAMS {
  endpoint: V1_ENDPOINT_KEY;
  // the values for the path placeholders.
  values?: Record<string, string>;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // the uppercase name of the call, for the log.
  label?: string;
  // turn the log off.
  quiet?: boolean;
  not_found_as_null?: boolean;
}

export async function api_get_path<t = unknown>({
  endpoint,
  values = {},
  config = {},
  signal,
  label,
  quiet = false,
  not_found_as_null = false,
}: API_GET_PATH_PARAMS): Promise<t | null> {
  const url = `${api_base_url("api", config)}${fill_path(endpoint, values)}`;
  const call_label = label ?? `V1 ${endpoint.toUpperCase()}`;

  return api_retry(
    async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      });

      if (response.status === 404 && not_found_as_null) {
        if (!quiet) {
          api_log({
            label: call_label,
            url,
            method: "GET",
            status: response.status,
            status_text: response.statusText,
            response: null,
          });
        }
        return null;
      }

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
            method: "GET",
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
          method: "GET",
          status: response.status,
          status_text: response.statusText,
          response: json,
        });
      }

      return json;
    },
    { attempts: 3 },
  );
}

// the same call, but for an endpoint that always answers.
//
// the api only ever answers 404 for an account that does not exist,
// so an endpoint that is not about one account cannot fail that way.
// this variant drops the null from the return type.
export async function api_get_path_required<t = unknown>(
  params: API_GET_PATH_PARAMS,
): Promise<t> {
  const result = await api_get_path<t>(params);
  if (result === null) {
    throw new Error(
      `api_get_path ${params.endpoint} answered with nothing`,
    );
  }
  return result;
}

// fill the placeholders in a path template.
//
// every placeholder must have a value. a leftover "{name}" would
// make the api answer something else, so it is an error rather than
// a silent miss.
function fill_path(
  endpoint: V1_ENDPOINT_KEY,
  values: Record<string, string>,
): string {
  const template = V1_ENDPOINT_PATHS[endpoint];

  const filled = template.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = values[name];
    if (value === undefined || value === "") {
      throw new Error(
        `api_get_path ${endpoint} needs a value for "${name}"`,
      );
    }
    return encodeURIComponent(value);
  });

  return filled;
}
// ========================================
// copyright 2026 by sleet.near
