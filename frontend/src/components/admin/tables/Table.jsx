import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import CaretUpSVG from "@/components/svg/CaretUpSVG"
import CaretDownSVG from "@/components/svg/CaretDownSVG"
import PaginationBar from "./PaginationBar"

// TOD0:Añadir loading
const Table = ({ data = [], columns = [], pageCount = 0, pagination, setPagination }) => {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: pageCount,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="overflow-x-auto bg-base-200 p-2 rounded-lg">
      <div className="mb-3 flex">
        <input
          className="input input-bordered flex-1"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
        <button className="btn btn-secondary" onClick={() => setGlobalFilter("")}>
          Clear
        </button>
      </div>

      <table className="table table-zebra">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  onClick={h.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  <div className="flex gap-1 items-center">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc" && <CaretUpSVG />}
                    {h.column.getIsSorted() === "desc" && <CaretDownSVG />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getAllColumns().length} className="text-center">
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PaginationBar table={table} />
    </div>
  )
}

export default Table
