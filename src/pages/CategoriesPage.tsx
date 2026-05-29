import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAllCategories } from "@/api/category-api"
import { getAllItems, getItemsByCategoryId } from "@/api/item-api"
import CategorySidebar from "@/components/CategorySidebar"
import ProductCard from "@/components/ProductCard"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import type { Category } from "@/type/category.type"
import type { Item } from "@/type/item.type"

export default function CategoriesPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [search, setSearch] = useState("")

  const selectedId = useMemo(() => {
    if (!categories.length) return null
    const parsed = Number(categoryId)
    if (categoryId && categories.some((c) => c.id === parsed)) {
      return parsed
    }
    return categories[0].id
  }, [categoryId, categories])

  const selectedCategory = categories.find((c) => c.id === selectedId)

  useEffect(() => {
    Promise.all([getAllCategories(), getAllItems()]).then(([cats, allItems]) => {
      setCategories(cats)
      const counts: Record<number, number> = {}
      for (const item of allItems) {
        counts[item.category_id] = (counts[item.category_id] ?? 0) + 1
      }
      setItemCounts(counts)
      setLoadingCategories(false)
    })
  }, [])

  useEffect(() => {
    if (!categories.length) return

    const parsed = Number(categoryId)
    const valid = categoryId && categories.some((c) => c.id === parsed)

    if (!valid) {
      navigate(`/categories/${categories[0].id}`, { replace: true })
    }
  }, [categoryId, categories, navigate])

  const loadItems = useCallback(async (id: number) => {
    setLoadingItems(true)
    const data = await getItemsByCategoryId(id)
    setItems(data)
    setLoadingItems(false)
  }, [])

  useEffect(() => {
    if (selectedId == null) return
    setSearch("")
    loadItems(selectedId)
  }, [selectedId, loadItems])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, search])

  const handleSelectCategory = (id: number) => {
    navigate(`/categories/${id}`)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0c381b]">
            Shop
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">
            {selectedCategory
              ? selectedCategory.category
              : "Browse our collection"}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Find the best products for your pet. Choose a category to explore.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <CategorySidebar
            categories={categories}
            selectedId={selectedId}
            loading={loadingCategories}
            itemCounts={itemCounts}
            onSelect={handleSelectCategory}
          />

          <section className="min-w-0 flex-1">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {loadingItems
                  ? "Loading products..."
                  : `${filteredItems.length} product${filteredItems.length === 1 ? "" : "s"} available`}
              </p>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#0c381b]/50" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in this category..."
                  className="h-10 rounded-full border-[#0c381b]/15 bg-white pl-9 shadow-sm focus-visible:border-[#0c381b]/40"
                  disabled={loadingItems || items.length === 0}
                />
              </div>
            </div>

            {loadingItems ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#0c381b]/20 bg-white py-20 text-center">
                <p className="text-lg font-medium text-gray-800">No products found</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {search
                    ? `Nothing matches "${search}" in ${selectedCategory?.category ?? "this category"}.`
                    : "Check back soon — new products are on the way."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
