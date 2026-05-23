import { z } from "zod"

export const CategorySchema = z.object({
  category: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
})

export type CategoryFormValues = z.infer<typeof CategorySchema>
