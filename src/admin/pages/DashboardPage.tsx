import { useEffect, useState } from "react"
import { FolderTree, Package, ShoppingBag, Users } from "lucide-react"
import { getAllCategories } from "@/api/category-api"
import DashboardStatCard from "@/admin/components/DashboardStatCard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardStat } from "@/type/admin.type"
import type { Category } from "@/type/category.type"

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data))
      .finally(() => setLoading(false))
  }, [])

  const stats: DashboardStat[] = [
    {
      title: "Categories",
      value: loading ? "—" : categories.length,
      description: "Active product categories",
      icon: FolderTree,
    },
    {
      title: "Products",
      value: "—",
      description: "Coming soon",
      icon: Package,
    },
    {
      title: "Orders",
      value: "—",
      description: "Coming soon",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: "—",
      description: "Coming soon",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your Happy Paws store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent categories</CardTitle>
          <CardDescription>
            Categories currently shown on the storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories yet. Add some from the Categories page.
            </p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="font-medium capitalize">
                    {category.category}
                  </span>
                  {category.created_at && (
                    <span className="text-muted-foreground text-xs">
                      {new Date(category.created_at).toLocaleDateString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
