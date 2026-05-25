import { supabase } from "@/superbase-client"
import type { ApiResult } from "@/type/api.type"
import type { Category } from "@/type/category.type"

export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true })
  if (error) {
    console.error("Error fetching categories", error)
    return []
  }

  return (data as Category[]) ?? []
}

export const createCategory = async (
  category: string
): Promise<ApiResult<Category>> => {
  const { data, error } = await supabase
    .from("categories")
    .insert({ category: category.trim() })
    .select()
    .single()

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data: data as Category }
}

export const updateCategory = async (
  id: number,
  category: string
): Promise<ApiResult<Category>> => {
  const { data, error } = await supabase
    .from("categories")
    .update({ category: category.trim() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data: data as Category }
}

export const deleteCategory = async (id: number): Promise<ApiResult<null>> => {
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data: null }
}
