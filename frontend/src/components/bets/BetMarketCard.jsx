import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import BetOptionPill from "./BetOptionPill"
import BetStatusBadge from "../badges/BetStatusBadge"
import { formatBetDate, sortBetOptions } from "@/utils/betsUtils"

const BetMarketCard = ({ bet }) => {
  const navigate = useNavigate()
  const { t } = useLocale()

  const previewOptions = sortBetOptions(bet.options || []).slice(0, 2)

  return (
    <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-primary/10">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-col items-start justify-between gap-3">
        <div className="shrink-0 pt-0.5">
          <BetStatusBadge status={bet.status} />
        </div>
        <h2 className="min-w-0 flex-1 wrap-break-words pr-2 text-lg sm:text-xl font-bold leading-tight text-base-content ">
          {bet.label}
        </h2>
      </div>

      <div className="relative rounded-xl border border-base-300 bg-base-200/70 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/90">
          {t("pages.bets.card.endsAt")}
        </p>
        <p className="mt-1.5 text-sm font-semibold md:text-base">
          {formatBetDate(bet.ends_at)}
        </p>
      </div>

      <div className="relative flex flex-1 flex-col gap-1.5">
        {previewOptions.length > 0 ? (
          previewOptions.map((option) => (
            <BetOptionPill
              key={option.id}
              label={option.label}
              odd={option.odd}
              compact
              disabled
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-base-300 bg-base-200/60 p-3 text-sm text-base-content/60">
            {t("pages.bets.card.noOptions")}
          </div>
        )}
      </div>

      <Button
        className="relative mt-1 w-full"
        variant={bet.status === "open" ? "primary" : "secondary"}
        size="md"
        onClick={() => navigate(`/bets/${bet.id}`, { state: { bet } })}>
        {t("pages.bets.card.viewMarket")}
      </Button>
    </article>
  )
}

export default BetMarketCard
