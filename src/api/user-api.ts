import { supabase } from "@/superbase-client"
import type { AccountType } from "@/type/admin.type"
import type { ApiResult } from "@/type/api.type"
import type { UserProfile } from "@/type/user.type"

export const getAllProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, address, account_type, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching profiles", error)
    return []
  }

  return (data as UserProfile[]) ?? []
}

export const getAccountType = async (
  userId: string,
  fallback?: string
): Promise<AccountType | "user"> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("Error fetching account type", error)
    return (fallback === "admin" ? "admin" : "user") as AccountType | "user"
  }

  const type = data?.account_type ?? fallback ?? "user"
  return type === "admin" ? "admin" : "user"
}

export const updateUserAccountType = async (
  userId: string,
  accountType: AccountType
): Promise<ApiResult<UserProfile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ account_type: accountType })
    .eq("id", userId)
    .select("id, full_name, phone, address, account_type, created_at")
    .single()

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data: data as UserProfile }
}
