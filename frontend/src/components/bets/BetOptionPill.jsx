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
      className={`w-full min-w-0 rounded-2xl border text-left transition-all duration-200 ${
        compact ? "p-3" : "p-4"
      } ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-base-300 bg-base-200 hover:border-primary/30 hover:bg-base-100"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="wrap-break-word text-sm font-semibold sm:text-md">
            {label}
          </p>
          <p className="text-xs sm:text-sm text-base-content/60">
            {t("pages.bets.detail.odds")}
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-base-100 px-3 py-2 text-md font-bold text-secondary sm:text-lg">
          x{normalizeBetOdd(odd)}
        </div>
      </div>
    </button>
  )
}

export default BetOptionPill
