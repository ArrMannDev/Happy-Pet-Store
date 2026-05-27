import { getAllCategories } from "@/api/category-api"
import { supabase } from "@/superbase-client"
import type { ApiResult } from "@/type/api.type"
import type {
  Item,
  ItemCreateInput,
  ItemUpdateInput,
} from "@/type/item.type"

const BUCKET = "item-images"

export function getStoragePathFromUrl(url: string): string | null {
  const markers = [`/${BUCKET}/`, `${BUCKET}/`]
  for (const marker of markers) {
    const idx = url.indexOf(marker)
    if (idx !== -1) {
      return decodeURIComponent(url.slice(idx + marker.length).split("?")[0])
    }
  }
  return null
}

export async function uploadItemImage(
    file: File,
    fileName: string
  ): Promise<ApiResult<string>> {
  
    console.log("Uploading file:", file)
    console.log("File type:", file.type)
  
    const path = `items/${fileName}`
  
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file)
  
    console.log("UPLOAD DATA:", data)
    console.log("UPLOAD ERROR:", error)
  
    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)
  
    return {
      success: true,
      data: publicUrlData.publicUrl,
    }
  }

async function removeItemImage(imageUrl: string) {
  const path = getStoragePathFromUrl(imageUrl)
  if (!path) return

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) {
    console.error("Error removing image", error.message)
  }
}

export const getAllItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching items", error)
    return []
  }

  return (data as Item[]) ?? []
}

export const getItemsWithCategory = async () => {
  const [items, categories] = await Promise.all([
    getAllItems(),
    getAllCategories(),
  ])

  const categoryMap = new Map(
    categories.map((c) => [c.id, c.category])
  )

  return items.map((item) => ({
    ...item,
    categories: categoryMap.has(item.category_id)
      ? { category: categoryMap.get(item.category_id)! }
      : null,
  }))
}

export const createItem = async (
  input: ItemCreateInput,
  imageFile: File
): Promise<ApiResult<Item>> => {
  const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
  const upload = await uploadItemImage(imageFile, fileName)

  if (upload.success === false) {
    return { success: false, message: upload.message }
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      name: input.name.trim(),
      price: input.price,
      category_id: input.category_id,
      stock: input.stock,
      image_url: upload.data,
    })
    .select()
    .single()

  if (error) {
    await removeItemImage(upload.data)
    return { success: false, message: error.message }
  }

  return { success: true, data: data as Item }
}

export const updateItem = async (
  id: number,
  input: ItemUpdateInput,
  imageFile?: File | null,
  currentImageUrl?: string
): Promise<ApiResult<Item>> => {
  let imageUrl = currentImageUrl

  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
    const upload = await uploadItemImage(imageFile, fileName)

    if (upload.success === false) {
      return { success: false, message: upload.message }
    }

    if (currentImageUrl) {
      await removeItemImage(currentImageUrl)
    }

    imageUrl = upload.data
  }

  const { data, error } = await supabase
    .from("items")
    .update({
      name: input.name.trim(),
      price: input.price,
      category_id: input.category_id,
      stock: input.stock,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data: data as Item }
}

export const deleteItem = async (item: Item): Promise<ApiResult<null>> => {
    console.log("Deleting item id:", item.id)
  
    // 1. Delete from items table first
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", item.id)
      .select()
  
    console.log("DELETE ITEM DATA:", data)
    console.log("DELETE ITEM ERROR:", error)
  
    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  
    // If no row deleted, likely RLS blocked silently
    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Item was not deleted. Check DELETE RLS policy on items table.",
      }
    }
  
    // 2. Delete image only after database row is deleted
    if (item.image_url) {
      await removeItemImage(item.image_url)
    }
  
    return {
      success: true,
      data: null,
    }
  }
