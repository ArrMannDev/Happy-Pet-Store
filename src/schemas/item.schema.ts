import { z } from "zod"

export const ItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be at most 120 characters"),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .max(999999, "Price is too large"),
  category_id: z.coerce
    .number()
    .int()
    .positive("Select a category"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
})

export type ItemFormValues = z.infer<typeof ItemSchema>
