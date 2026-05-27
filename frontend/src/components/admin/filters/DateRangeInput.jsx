import { useLocale } from "@/providers/LocaleProvider"
import React from "react"

const DateRangeInput = ({ fromDate, toDate, onChange, label }) => {
  const { t } = useLocale()

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {label || t("ui.tables.filters.dateRange")}
        </span>
      </label>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <input
          type="date"
          aria-label={t("ui.tables.filters.from")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0 appearance-none"
          value={fromDate || ""}
          onChange={(e) => onChange({ fromDate: e.target.value })}
        />

        <span className="hidden opacity-50 font-light shrink-0 sm:flex sm:items-center sm:justify-center">
          |
        </span>

        <input
          type="date"
          aria-label={t("ui.tables.filters.to")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0 appearance-none"
          value={toDate || ""}
          onChange={(e) => onChange({ toDate: e.target.value })}
        />
      </div>
    </div>
  )
}

export default DateRangeInput
