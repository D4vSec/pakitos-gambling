import React from "react"

const PaginationBar = ({ table }) => {
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
          disabled={!table.getCanPreviousPage()}
        >
          First
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>

        {/* Indicador de página actual */}
        <span className="text-sm font-medium mx-2">
          {pageIndex + 1} / {totalPages || 1}
        </span>

        <button
          className="btn btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap">Rows per page:</span>
        <select
          className="select select-sm select-bordered"
          value={pageSize}
          onChange={(e) => {
            const size = Number(e.target.value)
            table.setPageSize(size)
          }}
        >
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
