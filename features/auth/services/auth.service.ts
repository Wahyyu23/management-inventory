import { apiClient } from "@/lib/api/client";
import { LoginFormValues } from "../schema/auth.schema";
import {
  LoginInput,
  LoginResponse,
  RefreshTokenInput,
  RefreshTokenResponse,
} from "../types/auth.types";

export async function login(input: LoginInput) {
  return apiClient<LoginResponse>("auth/login", {
    method: "POST",
    body: input,
  });
}

export async function refreshToken(input: RefreshTokenInput) {
  return apiClient<RefreshTokenResponse>("auth/refresh-token", {
    method: "POST",
    body: input,
  });
}

export async function logout() {
  return apiClient<void>("auth/logout", {
    method: "POST",
  });
}
