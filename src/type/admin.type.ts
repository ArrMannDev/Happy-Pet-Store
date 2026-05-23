import type { LucideIcon } from "lucide-react"

export type AccountType = "admin" | "user"

export interface AdminNavItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface DashboardStat {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
}
