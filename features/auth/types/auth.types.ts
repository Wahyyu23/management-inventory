export type UserRole = "management" | "warehouse_admin" | "staff" | "borrower";

export type UserStatus = "active" | "inactive";

export type User = {
  id: string;
  user_code: string;
  name: string;

  email?: string;
  username?: string;

  role: UserRole;
  status: UserStatus;

  division?: string | null;
  created_at: string;
};

export type LoginInput ={
    username: string,
    password: string
};

export type LoginResult = {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    user: User
};

export type LoginResponse = {
    success: boolean,
    data: LoginResult
};

export type RefreshTokenInput = {
    refresh_token: string
};

export type RefreshTokenResult = {
    access_token: string,
    refresh_token: string,
    expires_in: number
};

export type RefreshTokenResponse = {
    success: boolean,
    data: RefreshTokenResult
}
