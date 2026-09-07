"use client"

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthReady, isAuthenticated } = useAuth();

  const router = useRouter( );

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated){
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
