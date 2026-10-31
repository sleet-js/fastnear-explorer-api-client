// ========================================
// API_GET
// the fetch helper for the GET endpoints — currently only the v1
// account overview.
//
// the v1 api answers 404 for an account that does not exist, and the
// caller usually wants that as a null rather than an exception, so
// `not_found_as_null` turns it into null.
// ========================================

import { create_api_error } from "./API_ERROR.js";
import type { API_CLIENT_CONFIG } from "./API_CLIENT_CONFIG.js";
import { api_retry } from "./API_RETRY.js";

export interface API_GET_PARAMS {
  url: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  label?: string;
  not_found_as_null?: boolean;
}

export async function api_get<t = unknown>({
  url,
  config = {},
  signal,
  label,
  not_found_as_null = false,
}: API_GET_PARAMS): Promise<t | null> {
  return api_retry(
    async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      });

      if (response.status === 404 && not_found_as_null) return null;

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw create_api_error(
          response.status,
          response.statusText,
          text,
          label ?? `api_get failed`,
        );
      }

      return (await response.json()) as t;
    },
    { attempts: 3 },
  );
}
// ========================================
// copyright 2026 by sleet.near
