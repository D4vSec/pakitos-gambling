import React from "react"

const PaginationBar = ({ table }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <button
          className="btn btn-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          First Page
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Prev
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </button>
        <button
          className="btn btn-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          Last Page
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <select
          className="select select-sm select-bordered"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}>
          {[1, 5, 10, 20, 50].map((size) => (
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
