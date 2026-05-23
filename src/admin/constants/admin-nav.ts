import {
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react"
import type { AdminNavItem } from "@/type/admin.type"

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
]
