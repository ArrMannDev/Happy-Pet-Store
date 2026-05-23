import type { AccountType } from "@/type/admin.type"

export interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  account_type: AccountType
  created_at?: string
}
