import { FiBell } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-5 w-px bg-border" />

        <span className="text-sm text-muted-foreground">
          Management Inventory
        </span>
      </div>

      <Button variant="ghost" size="icon">
        <FiBell />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  );
}
