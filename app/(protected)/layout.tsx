import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="Flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 bg-muted/30 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
