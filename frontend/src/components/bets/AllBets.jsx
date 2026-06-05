import React, { useMemo } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import Button from "@/components/buttons/Button"
import BetMarketCard from "@/components/bets/BetMarketCard"
import { useLocale } from "@/providers/LocaleProvider"

const AllBets = ({
  bets = [],
  totalBets = 0,
  page = 1,
  pageSize = 4,
  pageSizeOptions = [4, 8, 12, 16],
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  isRefreshing,
}) => {
  const { t } = useLocale()

  // Garantiza que solo se muestren los elementos correspondientes
  // al tamaño de página seleccionado.
  const visibleBets = useMemo(() => {
    return bets.slice(0, pageSize)
  }, [bets, pageSize])

  const startItem = totalBets === 0 ? 0 : (page - 1) * pageSize + 1

  const endItem =
    totalBets === 0
      ? 0
      : Math.min(startItem + visibleBets.length - 1, totalBets)

  const canGoBack = page > 1
  const canGoForward = page < totalPages

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value)

    // Volver a la primera página al cambiar el tamaño
    onPageChange?.(1)
    onPageSizeChange?.(newPageSize)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card border border-base-300 bg-base-200 p-3 shadow-xl shadow-primary/5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row items-center justify-center gap-6 md:flex-1 md:justify-start">
            <div className="flex min-w-0 items-center text-left">
              <span className="text-sm font-semibold text-base-content/70">
                {t("pages.bets.list.showing", {
                  start: startItem,
                  end: endItem,
                  total: totalBets,
                })}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2 md:ml-4">
              <span className="text-sm whitespace-nowrap text-base-content/70">
                {t("pages.bets.list.perPage")}
              </span>

              <select
                className="select select-bordered select-sm w-20 md:select-md"
                value={pageSize}
                onChange={handlePageSizeChange}>
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center md:w-auto md:justify-end">
            <div className="flex items-stretch justify-center">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className=" px-3 shadow-none btn-outline"
                disabled={!canGoBack}
                aria-label={t("pages.bets.list.previousPage")}
                onClick={() => onPageChange?.(page - 1)}>
                <IconChevronLeft size={18} />
              </Button>

              <span className="flex min-w-0 flex-1 items-center justify-center border-y border-base-300 bg-base-100 px-3 text-sm font-semibold sm:min-w-20 sm:flex-none">
                {page} / {Math.max(totalPages, 1)}
              </span>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                className=" px-3 shadow-none  btn-outline"
                disabled={!canGoForward}
                aria-label={t("pages.bets.list.nextPage")}
                onClick={() => onPageChange?.(page + 1)}>
                <IconChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 transition-opacity duration-200 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${
          isRefreshing ? "opacity-45" : "opacity-100"
        }`}>
        {visibleBets.map((bet) => (
          <BetMarketCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  )
}

export default AllBets
