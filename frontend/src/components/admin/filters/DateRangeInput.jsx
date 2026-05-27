import { useLocale } from "@/providers/LocaleProvider"
import React from "react"

const DateRangeInput = ({ fromDate, toDate, onChange }) => {
  const { t } = useLocale()

  return (
    <div className="flex flex-col w-full">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {t("ui.tables.filters.dateRange")}
        </span>
      </label>

      <div className="flex items-stretch w-full gap-1">
        <div className="flex-1 min-w-0">
          <input
            type="date"
            className="input input-bordered input-md bg-base-100 w-full min-w-0 appearance-none"
            value={fromDate || ""}
            onChange={(e) => onChange({ fromDate: e.target.value })}
          />
        </div>

        <span className="flex opacity-50 font-light shrink-0 items-center">
          |
        </span>

        <div className="flex-1 min-w-0">
          <input
            type="date"
            className="input input-bordered input-md bg-base-100 w-full min-w-0 appearance-none"
            value={toDate || ""}
            onChange={(e) => onChange({ toDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

export default DateRangeInput
