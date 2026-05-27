import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import ChevronLeftSVG from "@/components/svg/actions/ChevronLeftSVG"
import ChevronPipeLeftSVG from "@/components/svg/actions/ChevronPipeLeftSVG"
import ChevronRightSVG from "@/components/svg/actions/ChevronRightSVG"
import ChevronPipeRightSVG from "@/components/svg/actions/ChevronPipeRightSVG"

const PaginationBar = ({ table }) => {
  const { t } = useLocale()
  const state = table.getState()

  if (!state || !state.pagination) return null

  const { pageIndex, pageSize } = state.pagination
  const totalPages = table.getPageCount()
  const navButtonClass = "btn btn-sm btn-ghost sm:btn-outline"
  const mobileIconClass = "h-4 w-4"
  const iconOnlyButtonClass = "px-2 sm:px-3"

  const paginationButtons = [
    {
      key: "first",
      label: t("ui.tables.paginationBar.first"),
      icon: <ChevronPipeLeftSVG />,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
    },
    {
      key: "prev",
      label: t("ui.tables.paginationBar.prev"),
      icon: <ChevronLeftSVG />,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      iconClass: mobileIconClass,
    },
    {
      key: "next",
      label: t("ui.tables.paginationBar.next"),
      icon: <ChevronRightSVG />,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      iconClass: mobileIconClass,
    },
    {
      key: "last",
      label: t("ui.tables.paginationBar.last"),
      icon: <ChevronPipeRightSVG />,
      onClick: () => table.setPageIndex(totalPages - 1),
      disabled: !table.getCanNextPage(),
    },
  ]

  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row w-full items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {paginationButtons.slice(0, 2).map((button) => (
          <button
            key={button.key}
            className={`${navButtonClass} ${iconOnlyButtonClass}`}
            onClick={button.onClick}
            disabled={button.disabled}>
            <span className="hidden sm:inline">{button.label}</span>
            <span className={`sm:hidden ${button.iconClass ?? ""}`}>
              {button.icon}
            </span>
          </button>
        ))}

        <span className="min-w-18 text-center text-sm font-medium sm:min-w-22">
          {pageIndex + 1} / {totalPages || 1}
        </span>

        {paginationButtons.slice(2).map((button) => (
          <button
            key={button.key}
            className={`${navButtonClass} ${iconOnlyButtonClass}`}
            onClick={button.onClick}
            disabled={button.disabled}>
            <span className="hidden sm:inline">{button.label}</span>
            <span className={`sm:hidden ${button.iconClass ?? ""}`}>
              {button.icon}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
        <span className="text-sm whitespace-nowrap">
          {t("ui.tables.paginationBar.rowsPerPage")}
        </span>
        <select
          className="select select-bordered select-sm w-full min-w-0 sm:w-auto sm:min-w-24 md:select-md"
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
