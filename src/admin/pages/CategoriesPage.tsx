import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/api/category-api"
import CategoryFormSheet from "@/admin/components/CategoryFormSheet"
import ConfirmDialog from "@/admin/components/ConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { CategoryFormValues } from "@/schemas/category.schema"
import type { Category } from "@/type/category.type"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    const data = await getAllCategories()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleCreate = async (values: CategoryFormValues) => {
    const result = await createCategory(values.category)
    if (!result.success) {
      return { success: false, message: result.message }
    }
    setCategories((prev) => [...prev, result.data])
    return { success: true }
  }

  const handleUpdate = async (values: CategoryFormValues) => {
    if (!editingCategory) {
      return { success: false, message: "No category selected" }
    }

    const result = await updateCategory(editingCategory.id, values.category)
    if (!result.success) {
      return { success: false, message: result.message }
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === result.data.id ? result.data : c))
    )
    return { success: true }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    const result = await deleteCategory(deleteTarget.id)
    setDeleting(false)

    if (!result.success) {
      alert(result.message)
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const openCreate = () => {
    setEditingCategory(null)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Create, edit, and delete categories on the home page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Add category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
          <CardDescription>
            {loading
              ? "Loading..."
              : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} in your store`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No categories yet. Add your first category to get started.
              </p>
              <Button onClick={openCreate}>
                <Plus />
                Add category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium capitalize">
                        {category.category}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {category.created_at
                          ? new Date(category.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(category)}
                            aria-label={`Edit ${category.category}`}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(category)}
                            aria-label={`Delete ${category.category}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.category}"? This cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
