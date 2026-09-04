"use client";

import { FiBell } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";

export function AppHeader() {
  const { user, role, isAuthReady } = useAuth();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-5 w-px bg-border" />

        <span className="text-sm text-muted-foreground">
          Management Inventory
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-3">
          {!isAuthReady ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : user ? (
            <>
              <p className="text-sm text-muted-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not Signed In..</p>
          )}
        </div>

        <Button variant="ghost" size="icon">
          <FiBell />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
