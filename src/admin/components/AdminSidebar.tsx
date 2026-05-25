import { Link, useLocation } from "react-router-dom"
import { PawPrint, LogOut } from "lucide-react"
import { adminNavItems } from "@/admin/constants/admin-nav"
import { useAuth } from "@/Context/AuthContext"
import { supabase } from "@/superbase-client"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
  const location = useLocation()
  const { session } = useAuth()

  const displayName =
    session?.user.user_metadata?.full_name ??
    session?.user.email?.split("@")[0] ??
    "Admin"

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link to="/admin" />}
              className="data-active:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0c381b] text-white">
                <PawPrint className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Happy Paws</span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin Panel
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {adminNavItems.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-sm group-data-[collapsible=icon]:hidden">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0c381b]/10 text-xs font-semibold text-[#0c381b]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-muted-foreground">Admin</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
