import React, { useEffect, useMemo, useRef, useState } from "react"
import BetMarketCard from "@/components/bets/BetMarketCard"
import BetsFilterBar from "@/components/bets/BetsFilterBar"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import GradientBg from "@/components/layout/GradientBg"
import { IconCoins } from "@tabler/icons-react"
import useBets from "@/hooks/useBets"
import { useLocale } from "@/providers/LocaleProvider"
import Loading from "@/components/Loading"
import Subtitle from "@/components/layout/fonts/Subtitle"
import { PacmanLoader } from "react-spinners"

const BetsPage = () => {
  const { t } = useLocale()
  const { getBets } = useBets()
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const hasLoadedRef = useRef(false)
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  })

  const appliedFilters = useMemo(
    () => ({
      name: filters.name || "",
      status: filters.status || "",
    }),
    [filters],
  )

  useEffect(() => {
    let isActive = true

    const loadBets = async () => {
      if (!hasLoadedRef.current) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }

      const nextBets = await getBets(appliedFilters)

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
  }, [appliedFilters, getBets])

  if (loading) {
    return <Loading />
  }

  return (
    <GradientBg>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GoBackBtn link="/home" />

          <div className="badge badge-secondary badge-lg px-4 py-4 font-semibold">
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
          onChange={(nextFilters) =>
            setFilters((previousFilters) => ({
              ...previousFilters,
              ...nextFilters,
            }))
          }
        />

        <section className="relative min-h-40">
          {bets.length > 0 ? (
            <div
              className={`grid grid-cols-1 gap-4 transition-opacity duration-200 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${
                isRefreshing ? "opacity-45" : "opacity-100"
              }`}>
              {bets.map((bet) => (
                <BetMarketCard key={bet.id} bet={bet} />
              ))}
            </div>
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

          {isRefreshing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <PacmanLoader color="#fff" size={14} />
            </div>
          )}
        </section>
      </div>
    </GradientBg>
  )
}

export default BetsPage
