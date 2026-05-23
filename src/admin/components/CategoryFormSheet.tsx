import { useEffect, useState } from "react"
import { CategorySchema, type CategoryFormValues } from "@/schemas/category.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Category } from "@/type/category.type"

type CategoryFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (values: CategoryFormValues) => Promise<{ success: boolean; message?: string }>
}

export default function CategoryFormSheet({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormSheetProps) {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const isEdit = Boolean(category)

  useEffect(() => {
    if (open) {
      setName(category?.category ?? "")
      setErrors({})
    }
  }, [open, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = CategorySchema.safeParse({ category: name })
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setSubmitting(true)
    const result = await onSubmit(parsed.data)
    setSubmitting(false)

    if (!result.success) {
      setErrors({ category: [result.message ?? "Something went wrong"] })
      return
    }

    onOpenChange(false)
    setName("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit category" : "Add category"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the category name shown on the storefront."
              : "Create a new category for your store."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category name
            </label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dog, Cat, Toys"
              aria-invalid={Boolean(errors.category)}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category[0]}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
