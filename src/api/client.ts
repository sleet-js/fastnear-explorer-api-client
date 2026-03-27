/**
 * API client utility for making requests to FastNear Explorer API
 */

export interface ApiClientConfig {
  baseUrl?: string;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: undefined,
};

/**
 * Fetch data from the FastNear Explorer API
 * @param endpoint - API endpoint (e.g., "blocks", "account")
 * @param body - Request body parameters
 * @param config - Optional client configuration
 * @returns Promise resolving to API response
 * @throws Error if response is not ok
 */
export async function fetchApi<T>(
  endpoint: string,
  body: Record<string, unknown> = {},
  config: ApiClientConfig = DEFAULT_CONFIG
): Promise<T> {
  const baseUrl = config.baseUrl || (await import("./config")).apiBaseUrl;
  const res = await fetch(`${baseUrl}/v0/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
