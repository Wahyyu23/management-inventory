import { LoginResult, User } from "../types/auth.types";

const AUTH_SESSION_KEY = "management-inventory-auth-session";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveAuthSession(loginResult: LoginResult) {
  if (!isBrowser()) {
    return;
  }

  const session: AuthSession = {
    accessToken: loginResult.access_token,
    refreshToken: loginResult.refresh_token,
    user: loginResult.user,
  };

  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = sessionStorage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    clearAuthSession();

    return null;
  }
}

export function getAccessToken() {
  return getAuthSession()?.accessToken ?? null;
}

export function getRefreshToken() {
  return getAuthSession()?.refreshToken ?? null;
}

export function getCurrentUser() {
  return getAuthSession()?.user ?? null;
}

export function updateAccessToken(accessToken: string, refreshToken?: string) {
  if (!isBrowser()) {
    return;
  }

  const session = getAuthSession();

  if (!session) {
    return;
  }

  const updateSession: AuthSession = {
    ...session,

    accessToken,

    refreshToken: refreshToken ?? session.refreshToken,
  };

  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updateSession));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
