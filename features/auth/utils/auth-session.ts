import type { LoginResult, User } from "../types/auth.types";

const AUTH_SESSION_KEY = "management-inventory-auth-session";

const LOGIN_ROLES = ["management", "warehouse_admin", "staff"] as const;

type LoginRole = (typeof LOGIN_ROLES)[number];

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isLoginRole(value: unknown): value is LoginRole {
  return typeof value === "string" && LOGIN_ROLES.includes(value as LoginRole);
}

function isValidSessionUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isLoginRole(value.role)
  );
}

function isValidAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.accessToken) &&
    isNonEmptyString(value.refreshToken) &&
    isValidSessionUser(value.user)
  );
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

  if (!isValidAuthSession(session)) {
    clearAuthSession();

    throw new Error("Invalid authentication session");
  }

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
    const parsedSession: unknown = JSON.parse(rawSession);

    if (!isValidAuthSession(parsedSession)) {
      clearAuthSession();

      return null;
    }

    return parsedSession;
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

  const updatedSession: AuthSession = {
    ...session,

    accessToken,

    refreshToken: refreshToken ?? session.refreshToken,
  };

  if (!isValidAuthSession(updatedSession)) {
    clearAuthSession();

    return;
  }

  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedSession));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
