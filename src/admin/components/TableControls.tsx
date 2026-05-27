import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TableSearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TableSearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: TableSearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  )
}

type TablePaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  rangeStart: number
  rangeEnd: number
  filteredCount: number
  totalCount: number
}

export function TablePagination({
  page,
  totalPages,
  onPageChange,
  rangeStart,
  rangeEnd,
  filteredCount,
  totalCount,
}: TablePaginationProps) {
  if (totalCount === 0) return null

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {rangeStart}–{rangeEnd} of {filteredCount}
        {filteredCount !== totalCount && ` (filtered from ${totalCount})`}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
