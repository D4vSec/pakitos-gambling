import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { normalizeBetOdd } from "@/utils/betsUtils"

const BetOptionPill = ({
  label,
  odd,
  selected = false,
  onClick,
  disabled = false,
  compact = false,
}) => {
  const { t } = useLocale()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border text-left transition-all duration-200 ${
        compact ? "p-3" : "p-4"
      } ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-base-300 bg-base-200 hover:border-primary/30 hover:bg-base-100"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold md:text-base">{label}</p>
          <p className="text-xs text-base-content/60">{t("pages.bets.detail.odds")}</p>
        </div>

        <div className="rounded-xl bg-base-100 px-3 py-2 text-sm font-bold text-primary">
          x{normalizeBetOdd(odd)}
        </div>
      </div>
    </button>
  )
}

export default BetOptionPill
