"use client";

import Link from "next/link";
import {
  FiGrid,
  FiBox,
  FiDownload,
  FiUpload,
  FiRotateCcw,
  FiPackage,
} from "react-icons/fi";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  hasPermission,
  Permission,
} from "@/features/auth/config/authorization";
import { useAuth } from "@/contexts/authContext";

function capitalizeWord() {}

const menuItems: {
  title: string;
  url: string;
  icon: typeof FiGrid;
  permission: Permission;
}[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: FiGrid,
    permission: "dashboard.view",
  },
  {
    title: "Receiving",
    url: "/receiving",
    icon: FiDownload,
    permission: "receiving.create",
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: FiPackage,
    permission: "inventory.view",
  },
  {
    title: "Borrowing",
    url: "/borrowing",
    icon: FiUpload,
    permission: "borrowing.create",
  },
  {
    title: "Return",
    url: "/return",
    icon: FiRotateCcw,
    permission: "return.create",
  },
];

export function AppSidebar() {
  const { role, user } = useAuth();

  const accessibleMenuItems = menuItems.filter((item) =>
    hasPermission(role, item.permission),
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex h-12 items-center gap-3 px-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary-foreground">
            <FiBox className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Management</span>
            <span className="truncate text-xs text-muted-foreground">
              Inventory
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-medium">{user?.name ?? "-"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
