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
import CustomPaginationBar from "./CustomPaginationBar"

const Table = ({ data = [], columns = [], paginationEvents }) => {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="overflow-x-auto bg-base-200 p-2 rounded-lg">
      <div className="mb-3">
        <input
          className="input input-bordered w-full"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </div>

      <table className="table table-zebra">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  onClick={h.column.getToggleSortingHandler()}
                  className="cursor-pointer">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPaginationBar events={paginationEvents} />
    </div>
  )
}

export default Table
