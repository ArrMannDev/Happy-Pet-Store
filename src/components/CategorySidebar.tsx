import { ChevronRight, LayoutGrid } from "lucide-react"
import { getCategoryImage } from "@/lib/category-images"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category } from "@/type/category.type"

type CategorySidebarProps = {
  categories: Category[]
  selectedId: number | null
  loading: boolean
  itemCounts?: Record<number, number>
  onSelect: (id: number) => void
}

export default function CategorySidebar({
  categories,
  selectedId,
  loading,
  itemCounts = {},
  onSelect,
}: CategorySidebarProps) {
  if (loading) {
    return (
      <>
        <aside className="hidden md:block md:w-72 lg:w-80">
          <SidebarSkeleton />
        </aside>
        <MobileSkeleton />
      </>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#0c381b]/20 bg-white p-6 text-center text-sm text-muted-foreground">
        No categories available yet.
      </p>
    )
  }

  return (
    <>
      {/* Mobile: horizontal category strip */}
      <div className="md:hidden">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0c381b]">
          Categories
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category, index) => {
            const isActive = category.id === selectedId
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category.id)}
                className={`flex shrink-0 flex-col items-center gap-2 rounded-2xl p-2 transition-all ${
                  isActive ? "bg-[#0c381b] text-white shadow-md" : "bg-white shadow-sm"
                }`}
              >
                <img
                  src={getCategoryImage(index)}
                  alt=""
                  className={`size-14 rounded-xl object-cover ring-2 ${
                    isActive ? "ring-white/40" : "ring-[#0c381b]/10"
                  }`}
                />
                <span
                  className={`max-w-[72px] truncate text-xs font-medium capitalize ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {category.category}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: sidebar panel */}
      <aside className="hidden md:block md:w-72 lg:w-80">
        <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(12,56,27,0.08)] ring-1 ring-[#0c381b]/10">
          <div
            className="relative px-5 py-6 text-white"
            style={{
              background: "linear-gradient(135deg, #0c381b 0%, #1a6b36 100%)",
            }}
          >
            <div className="absolute -top-6 -right-6 size-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-4 size-20 rounded-full bg-white/5" />
            <div className="relative flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <LayoutGrid className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                  Happy Paws
                </p>
                <h2 className="text-lg font-bold">Categories</h2>
              </div>
            </div>
          </div>

          <nav className="p-3">
            <ul className="space-y-1.5">
              {categories.map((category, index) => {
                const isActive = category.id === selectedId
                const count = itemCounts[category.id]

                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(category.id)}
                      className={`group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all ${
                        isActive
                          ? "bg-[#0c381b]/8 shadow-sm ring-1 ring-[#0c381b]/15"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <img
                        src={getCategoryImage(index)}
                        alt=""
                        className={`size-12 shrink-0 rounded-lg object-cover transition-transform ${
                          isActive
                            ? "ring-2 ring-[#0c381b]/30"
                            : "ring-1 ring-gray-200 group-hover:scale-105"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold capitalize ${
                            isActive ? "text-[#0c381b]" : "text-gray-800"
                          }`}
                        >
                          {category.category}
                        </p>
                        {count !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {count} product{count === 1 ? "" : "s"}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        className={`size-4 shrink-0 transition-transform ${
                          isActive
                            ? "text-[#0c381b] translate-x-0.5"
                            : "text-gray-300 group-hover:text-gray-400"
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

function SidebarSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="flex gap-3 md:hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="size-20 shrink-0 rounded-2xl" />
      ))}
    </div>
  )
}
