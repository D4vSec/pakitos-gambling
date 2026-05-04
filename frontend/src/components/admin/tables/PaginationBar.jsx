import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const PaginationBar = ({ table }) => {
  const { t } = useLocale()
  const state = table.getState()

  if (!state || !state.pagination) return null

  const { pageIndex, pageSize } = state.pagination
  const totalPages = table.getPageCount()

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-2 items-center">
        <button
          className="btn btn-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          {t("ui.tables.paginationBar.first")}
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          {t("ui.tables.paginationBar.prev")}
        </button>

        {/* Indicador de página actual */}
        <span className="text-sm font-medium mx-2">
          {pageIndex + 1} / {totalPages || 1}
        </span>

        <button
          className="btn btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          {t("ui.tables.paginationBar.next")}
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage()}>
          {t("ui.tables.paginationBar.last")}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap">
          {t("ui.tables.paginationBar.rowsPerPage")}
        </span>
        <select
          className="select select-sm select-bordered"
          value={pageSize}
          onChange={(e) => {
            const size = Number(e.target.value)
            table.setPageSize(size)
          }}>
          {[1, 5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default PaginationBar
