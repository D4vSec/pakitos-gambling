import React from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useLocale } from "@/providers/LocaleProvider"
import CaretUpSVG from "@/components/svg/actions/CaretUpSVG"
import CaretDownSVG from "@/components/svg/actions/CaretDownSVG"
import PaginationBar from "./PaginationBar"

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
  const columnCount = columns.length || 1

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
    <div className="rounded-lg bg-base-200 py-2 sm:px-4">
      <div className="overflow-x-auto">
        <table className="table table-sm md:table-md table-zebra min-w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="cursor-pointer whitespace-nowrap">
                    <div className="flex items-center gap-1">
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
                <td colSpan={columnCount} className="py-6 text-center">
                  {t("ui.tables.noData")}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationBar table={table} />
    </div>
  )
}

export default Table
