import { UserRole } from "../types/auth.types";

export type Permission =
  | "dashboard.view"
  | "receiving.create"
  | "inventory.view"
  | "inventory.manage"
  | "borrowing.create"
  | "return.create"
  | "users.image"
  | "user.list"
  | "user.manage"
  | "activity.view"
  | "report.view";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  management: [
    "dashboard.view",
    "user.list",
    "user.manage",
    "report.view",
    "activity.view",
  ],
  warehouse_admin: [
    "dashboard.view",
    "receiving.create",
    "inventory.view",
    "inventory.manage",
    "user.list",
    "activity.view",
  ],
  staff: ["dashboard.view", "borrowing.create", "return.create"],
  borrower: [],
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
