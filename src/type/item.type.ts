export interface Item {
  id: number
  name: string
  price: number
  image_url: string
  category_id: number
  stock: number
  created_at?: string
}

export type ItemCreateInput = {
  name: string
  price: number
  category_id: number
  stock: number
}

export type ItemUpdateInput = ItemCreateInput
