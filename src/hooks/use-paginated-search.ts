import { useEffect, useMemo, useState } from "react"

const DEFAULT_PAGE_SIZE = 10

export function usePaginatedSearch<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => filterFn(item, query))
  }, [items, search, filterFn])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  useEffect(() => {
    setPage(1)
  }, [search, items.length])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, filtered.length)

  return {
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    paginated,
    filteredCount: filtered.length,
    totalCount: items.length,
    rangeStart,
    rangeEnd,
    pageSize,
  }
}
