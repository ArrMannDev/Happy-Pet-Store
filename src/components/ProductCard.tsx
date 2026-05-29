import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Item } from "@/type/item.type"

export default function ProductCard({ item }: { item: Item }) {
  const outOfStock = item.stock <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={item.image_url}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 font-semibold text-gray-900">{item.name}</h3>
          <p className="mt-1 text-lg font-bold text-[#0c381b]">
            {Number(item.price).toLocaleString()} MMK
          </p>
          {!outOfStock && (
            <p className="mt-1 text-xs text-muted-foreground">
              {item.stock} in stock
            </p>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full border-[#0c381b] text-[#0c381b] hover:bg-[#0c381b] hover:text-white"
          disabled={outOfStock}
          render={<Link to="/cart" />}
        >
          <ShoppingCart />
          {outOfStock ? "Unavailable" : "Add to cart"}
        </Button>
      </div>
    </article>
  )
}
