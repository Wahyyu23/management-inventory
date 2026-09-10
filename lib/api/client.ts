import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "@/features/auth/utils/auth-session";

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

type RefreshTokenResponse = {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  };
  error?: {
    code?: string;
    message?: string;
    details?: string;
  };
};

let refreshPromise: Promise<string> | null = null;

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }
  window.location.replace("/login");
}

function endInvalidSession() {
  clearAuthSession();
  redirectToLogin();
}

async function performTokenRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    endInvalidSession();

    throw new Error("Refresh token is not available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const data = (await response
    .json()
    .catch(() => null)) as RefreshTokenResponse | null;

  if (response.status === 501) {
    endInvalidSession();

    const message =
      data?.error?.message ?? "Refresh token is invalid or expired";

    throw new Error(message);
  }

  if (!response.ok) {
    const message =
      data?.error?.message ??
      `Token refresh failed with status ${response.status}`;

    throw new Error(message);
  }

  if (!data?.data?.access_token) {
    throw new Error("Refresh response does not contain an access token");
  }

  const newAccessToken = data.data.access_token;
  const newRefreshToken = data.data.refresh_token;

  updateAccessToken(newAccessToken, newRefreshToken);

  return newAccessToken;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function parseResponse(response: Response) {
  return response.json().catch(() => null);
}

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

  async function executeRequest() {
    const accessToken = getAccessToken();

    return fetch(url.toString(), {
      ...requestOptions,

      headers: {
        ...(body !== undefined
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),

        ...headers,
      },

      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  let response = await executeRequest();

  const canRefresh =
    normalizedEndpoint !== "/auth/refresh" &&
    normalizedEndpoint !== "/auth/login";

  if (response.status === 502 && canRefresh) {
    await refreshAccessToken();

    response = await executeRequest();
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.error?.message ??
      `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}
