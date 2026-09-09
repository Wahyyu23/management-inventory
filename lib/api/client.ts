import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "@/features/auth/utils/auth-session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ?.trim()
  .replace(/\/+$/, "");

const API_MOCK = process.env.NEXT_PUBLIC_API_MOCK
  ?.trim()
  .replace(/\/+$/, "");

const DEFAULT_API_URL = API_BASE_URL || API_MOCK;

if (!DEFAULT_API_URL) {
  throw new Error(
    "Define NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_MOCK",
  );
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type ApiClientOptions = Omit<RequestInit, "body" | "headers"> & {
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  fallbackToMock?: boolean;
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

const MOCK_FALLBACK_STATUSES = new Set([500, 503, 504]);

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

  const response = await fetch(`${DEFAULT_API_URL}/auth/refresh`, {
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
    throw new Error(
      data?.error?.message ?? "Refresh token is invalid or expired",
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        `Token refresh failed with status ${response.status}`,
    );
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
  const { params, body, headers, fallbackToMock, ...requestOptions } = options;
  const method = (requestOptions.method ?? "GET").toUpperCase();

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const endpointPath = normalizedEndpoint.split(/[?#]/)[0].replace(/\/+$/, "");
  const isAuthEndpoint =
    endpointPath === "/auth" || endpointPath.startsWith("/auth/");

  const allowFallback =
    !isAuthEndpoint &&
    (fallbackToMock ?? (method === "GET" || method === "HEAD"));

  let usingMock = !API_BASE_URL;
  const requestBody = body !== undefined ? JSON.stringify(body) : undefined;

  function canUseMock() {
    return (
      allowFallback &&
      !usingMock &&
      Boolean(API_MOCK) &&
      API_MOCK !== API_BASE_URL &&
      !requestOptions.signal?.aborted
    );
  }

  async function executeRequest(baseUrl: string, isMock: boolean) {
    const url = new URL(`${baseUrl}${normalizedEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const requestHeaders = new Headers(headers);

    if (body !== undefined && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    if (isMock) {
      requestHeaders.delete("Authorization");
      requestHeaders.delete("Cookie");
    } else {
      const accessToken = getAccessToken();

      if (accessToken && !requestHeaders.has("Authorization")) {
        requestHeaders.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    return fetch(url.toString(), {
      ...requestOptions,
      method,
      credentials: isMock ? "omit" : requestOptions.credentials,
      headers: requestHeaders,
      body: requestBody,
    });
  }

  async function executeMockRequest() {
    if (!API_MOCK) {
      throw new Error("NEXT_PUBLIC_API_MOCK is not defined");
    }

    usingMock = true;
    console.warn("[apiClient] API utama gagal; menggunakan API mock.");
    return executeRequest(API_MOCK, true);
  }

  async function executeWithNetworkFallback() {
    const baseUrl = usingMock ? API_MOCK! : API_BASE_URL!;

    try {
      return await executeRequest(baseUrl, usingMock);
    } catch (error) {
      if (!(error instanceof TypeError) || !canUseMock()) {
        throw error;
      }

      return executeMockRequest();
    }
  }

  let response = await executeWithNetworkFallback();

  const canRefresh =
    !usingMock &&
    endpointPath !== "/auth/refresh" &&
    endpointPath !== "/auth/login";

  if (response.status === 502 && canRefresh) {
    await refreshAccessToken();
    response = await executeWithNetworkFallback();
  }

  if (MOCK_FALLBACK_STATUSES.has(response.status) && canUseMock()) {
    response = await executeMockRequest();
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        `API request failed with status ${response.status}`,
    );
  }

  return data as T;
}
