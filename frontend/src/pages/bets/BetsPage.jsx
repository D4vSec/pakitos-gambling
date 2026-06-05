import React, { useEffect, useMemo, useRef, useState } from "react"
import AllBets from "@/components/bets/AllBets"
import BetsFilterBar from "@/components/bets/BetsFilterBar"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import GradientBg from "@/components/layout/GradientBg"
import { IconCoins } from "@tabler/icons-react"
import useBets from "@/hooks/useBets"
import { useLocale } from "@/providers/LocaleProvider"
import Loading from "@/components/Loading"
import Subtitle from "@/components/layout/fonts/Subtitle"

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16]
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[1]

const BetsPage = () => {
  const { t } = useLocale()
  const { getBets } = useBets()
  const [bets, setBets] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const hasLoadedRef = useRef(false)
  const getBetsRef = useRef(getBets)
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    fromEndsAt: "",
    toEndsAt: "",
  })

  useEffect(() => {
    getBetsRef.current = getBets
  }, [getBets])

  const appliedFilters = useMemo(
    () => ({
      name: filters.name || "",
      status: filters.status || "",
      fromEndsAt: filters.fromEndsAt || "",
      toEndsAt: filters.toEndsAt || "",
    }),
    [filters],
  )

  const totalPages = Math.max(1, Math.ceil(bets.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedBets = useMemo(() => {
    const start = (safePage - 1) * pageSize

    return bets.slice(start, start + pageSize)
  }, [bets, safePage, pageSize])

  useEffect(() => {
    let isActive = true

    const loadBets = async () => {
      if (!hasLoadedRef.current) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }

      const nextBets = await getBetsRef.current(appliedFilters)

      if (!isActive) return

      setBets(nextBets)
      hasLoadedRef.current = true
      setLoading(false)
      setIsRefreshing(false)
    }

    loadBets()

    return () => {
      isActive = false
    }
  }, [appliedFilters])

  if (loading) {
    return <Loading clear />
  }

  return (
    <GradientBg>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GoBackBtn link="/home" className="w-full md:w-fit" />

          <div className="w-full md:w-fit badge badge-secondary badge-lg px-4 py-4 font-semibold">
            {t("pages.bets.list.marketCount", { count: bets.length })}
          </div>
        </div>

        <section className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl shadow-primary/5 md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary p-2 sm:p-2.5">
              <IconCoins />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <Subtitle className="m-0 text-left text-4xl md:text-5xl">
                {t("pages.bets.list.title")}
              </Subtitle>
              <p className="max-w-3xl text-sm text-base-content/70 md:text-base">
                {t("pages.bets.list.description")}
              </p>
            </div>
          </div>
        </section>

        <BetsFilterBar
          filters={filters}
          onChange={(nextFilters) => {
            setFilters((previousFilters) => ({
              ...previousFilters,
              ...nextFilters,
            }))
            setPage(1)
          }}
        />

        <section className="relative min-h-40">
          {bets.length > 0 ? (
            <AllBets
              bets={paginatedBets}
              totalBets={bets.length}
              page={safePage}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
              isRefreshing={isRefreshing}
            />
          ) : (
            <div
              className={`rounded-4xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl transition-opacity duration-200 ${
                isRefreshing ? "opacity-45" : "opacity-100"
              }`}>
              <h2 className="text-xl md:text-2xl font-bold">
                {t("pages.bets.list.emptyTitle")}
              </h2>
              <p className="mt-3 text-sm md:text-md text-base-content/70">
                {t("pages.bets.list.emptyDescription")}
              </p>
            </div>
          )}

          {isRefreshing && <Loading clear />}
        </section>
      </div>
    </GradientBg>
  )
}

export default BetsPage
