"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  hasPermission,
  Permission,
} from "@/features/auth/config/authorization";

const ROUTE_PERMISSION: Partial<Record<string, Permission>> = {
  "/dashboard": "dashboard.view",
  "/receiving": "receiving.create",
  "/inventory": "inventory.view",
  "/borrowing": "borrowing.create",
  "/return": "return.create",
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthReady, isAuthenticated, role } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const requiredPermission = ROUTE_PERMISSION[pathname];

  const canAccessCurrentRoute =
    !requiredPermission || hasPermission(role, requiredPermission);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAuthReady || !isAuthenticated) {
      return;
    }

    if (pathname === "/unauthorized") {
      return;
    }

    if (!canAccessCurrentRoute) {
      router.replace("/unauthorized");
    }
  }, [isAuthReady, isAuthenticated, router, canAccessCurrentRoute, pathname]);

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (pathname !== "/unauthorized" && !canAccessCurrentRoute) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 bg-muted/30 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
