import { getAccessToken } from "@/features/auth/utils/auth-session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type ApiClientOptions = Omit<RequestInit, "body" | "headers"> & {
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { params, body, headers, ...requestOptions } = options;

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const accessToken = getAccessToken();

  const response = await fetch(url.toString(), {
    ...requestOptions,

    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),

      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      ...headers,
    },

    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ??
      `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}
