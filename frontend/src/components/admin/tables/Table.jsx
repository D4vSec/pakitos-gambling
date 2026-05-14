import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useLocale } from "@/providers/LocaleProvider"
import CaretUpSVG from "@/components/svg/flags/CaretUpSVG"
import CaretDownSVG from "@/components/svg/actions/CaretDownSVG"
import PaginationBar from "./PaginationBar"

// TODO:Añadir loading
// TODO: Arreglar diseño tabla
const Table = ({
  data = [],
  columns = [],
  pageCount = 0,
  pagination,
  setPagination,
  sorting,
  setSorting,
}) => {
  const { t } = useLocale()

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    pageCount: pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-base-200 p-4 rounded-lg overflow-x-scroll">
      <table className="table table-sm md:table-md table-zebra">
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
                {t("ui.tables.noData")}
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
