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

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: FiGrid,
  },
  {
    title: "Receiving",
    url: "/receiving",
    icon: FiDownload,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: FiPackage,
  },
  {
    title: "Borrowing",
    url: "/borrowing",
    icon: FiUpload,
  },
  {
    title: "Return",
    url: "/return",
    icon: FiRotateCcw,
  },
];

export function AppSidebar() {
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
              {menuItems.map((item) => (
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
          <p className="truncate text-sm font-medium">Administrator</p>
          <p className="truncate text-xs text-muted-foreground">Admin</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
