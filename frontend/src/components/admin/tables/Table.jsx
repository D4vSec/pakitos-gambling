import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useLocale } from "@/providers/LocaleProvider"
import CaretUpSVG from "@/components/svg/CaretUpSVG"
import CaretDownSVG from "@/components/svg/CaretDownSVG"
import PaginationBar from "./PaginationBar"

// TODO:Añadir loading
// TODO: Arreglar diseño tabla
const Table = ({
  data = [],
  columns = [],
  pageCount = 0,
  pagination,
  setPagination,
}) => {
  const { t } = useLocale()
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
    <div className="bg-base-200 p-2 rounded-lg">
      <div className="mb-3 flex">
        <label htmlFor="" className="floating-label flex-1">
          <span>{t("tables.searchBar.label")}</span>
          <input
            className="input input-bordered w-full"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </label>
        <button
          className="btn btn-secondary"
          onClick={() => setGlobalFilter("")}>
          {t("tables.searchBar.clear")}
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="text-center">
                {t("tables.noData")}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
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
