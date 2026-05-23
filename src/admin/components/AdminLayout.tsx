import { Outlet, useLocation } from "react-router-dom"
import AdminSidebar from "@/admin/components/AdminSidebar"
import AdminHeader from "@/admin/components/AdminHeader"
import RequireAdmin from "@/admin/components/RequireAdmin"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { adminNavItems } from "@/admin/constants/admin-nav"

function getPageTitle(pathname: string) {
  const match = adminNavItems.find((item) =>
    item.url === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.url)
  )
  return match?.title ?? "Admin"
}

export default function AdminLayout() {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <RequireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader title={title} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAdmin>
  )
}
