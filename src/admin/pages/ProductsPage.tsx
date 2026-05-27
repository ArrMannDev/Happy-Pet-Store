import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import {
  createItem,
  deleteItem,
  getItemsWithCategory,
  updateItem,
} from "@/api/item-api"
import ItemFormSheet from "@/admin/components/ItemFormSheet"
import ConfirmDialog from "@/admin/components/ConfirmDialog"
import {
  TablePagination,
  TableSearchBar,
} from "@/admin/components/TableControls"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaginatedSearch } from "@/hooks/use-paginated-search"
import type { ItemFormValues } from "@/schemas/item.schema"
import type { Item } from "@/type/item.type"

type ItemRow = Item & {
  categories?: { category: string } | null
}

const filterProduct = (item: ItemRow, query: string) => {
  const name = item.name.toLowerCase()
  const category = item.categories?.category?.toLowerCase() ?? ""
  return name.includes(query) || category.includes(query)
}

export default function ProductsPage() {
  const [items, setItems] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)
  const [deleting, setDeleting] = useState(false)

  const {
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    paginated,
    filteredCount,
    totalCount,
    rangeStart,
    rangeEnd,
  } = usePaginatedSearch(items, filterProduct)

  const loadItems = useCallback(async () => {
    setLoading(true)
    const data = await getItemsWithCategory()
    setItems(data as ItemRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleCreate = async (
    values: ItemFormValues,
    imageFile: File | null
  ) => {
    if (!imageFile) {
      return { success: false, message: "Image is required" }
    }

    const result = await createItem(values, imageFile)
    if (result.success === false) {
      return { success: false, message: result.message }
    }

    await loadItems()
    return { success: true }
  }

  const handleUpdate = async (
    values: ItemFormValues,
    imageFile: File | null
  ) => {
    if (!editingItem) {
      return { success: false, message: "No product selected" }
    }

    const result = await updateItem(
      editingItem.id,
      values,
      imageFile,
      editingItem.image_url
    )

    if (result.success === false) {
      return { success: false, message: result.message }
    }

    await loadItems()
    return { success: true }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    const result = await deleteItem(deleteTarget)
    setDeleting(false)

    if (result.success === false) {
      alert(result.message)
      return
    }

    setDeleteTarget(null)
    await loadItems()
  }

  const openCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const openEdit = (item: Item) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const showEmptyState = !loading && totalCount === 0
  const showNoResults = !loading && totalCount > 0 && filteredCount === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage store products and images in the item-images bucket.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Add product
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>All products</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `${totalCount} product${totalCount === 1 ? "" : "s"}`}
              </CardDescription>
            </div>
            {!loading && totalCount > 0 && (
              <TableSearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name or category..."
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No products yet. Add one or run{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  npm run seed
                </code>{" "}
                to insert 50 sample items.
              </p>
              <Button onClick={openCreate}>
                <Plus />
                Add product
              </Button>
            </div>
          ) : showNoResults ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No products match &quot;{search}&quot;.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="size-12 rounded-md border object-cover"
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">
                          {item.categories?.category ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {Number(item.price)} MMK
                        </td>
                        <td className="px-4 py-3">{item.stock}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(item)}
                              aria-label={`Delete ${item.name}`}
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

              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                filteredCount={filteredCount}
                totalCount={totalCount}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ItemFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        onSubmit={editingItem ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.name}" and remove its image from storage?`
            : ""
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
