import { useState, useEffect, useCallback, useRef } from "react"

const useTable = (fetchFn, initialFilters = {}, initialSorting = []) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fetchFnRef = useRef(fetchFn)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const [sorting, setSorting] = useState(initialSorting)

  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    fetchFnRef.current = fetchFn
  }, [fetchFn])

  const loadData = useCallback(async () => {
    setIsLoading(true)

    const sortBy = sorting.length > 0 ? sorting[0].id : undefined
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "none"

    const { filters: activeFilters, ...rest } = filters

    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy,
      sortOrder,
      ...rest,
    }

    if (activeFilters && activeFilters.length > 0) {
      params.filters = JSON.stringify(activeFilters)
    }

    if (!params.filterField || !params.filterValue) {
      delete params.filterField
      delete params.filterValue
    }

    const res = await fetchFnRef.current(params)
    if (res) setData(res)

    setIsLoading(false)
  }, [pagination.pageIndex, pagination.pageSize, sorting, filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [initialFilters])

  return {
    data,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    handleFilterChange,
    resetFilters,
    refresh: loadData,
  }
}

export default useTable
