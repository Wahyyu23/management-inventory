import { UserRole } from "../types/auth.types";

export type Permission =
  | "dashboard.view"
  | "receiving.create"
  | "inventory.view"
  | "inventory.manage"
  | "borrowing.create"
  | "return.create"
  | "users.manage"
  | "users.list"
  | "users.manage"
  | "activity.view"
  | "reports.view";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  management: [
    "dashboard.view",
    "users.list",
    "users.manage",
    "reports.view",
    "activity.view",
  ],
  warehouse_admin: [
    "dashboard.view",
    "receiving.create",
    "inventory.view",
    "inventory.manage",
    "users.list",
    "activity.view",
  ],
  staff: ["dashboard.view", "borrowing.create", "return.create"],
  borrower: [],
};

export const PROTECTED_ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/dashboard": "dashboard.view",

  "/receiving": "receiving.create",

  "/inventory": "inventory.view",

  "/borrowing": "borrowing.create",

  "/return": "return.create",
};

export function hasPermission(
  role: UserRole | null,
  permission: Permission,
): boolean {
  if (!role) {
    return false;
  }

  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAccessRoute(
  role: UserRole | null,
  pathname: string,
): boolean {
  const requiredPermission = PROTECTED_ROUTE_PERMISSIONS[pathname];

  if (!requiredPermission) {
    return false;
  }

  return hasPermission(role, requiredPermission);
}
