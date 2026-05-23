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

      <div className="flex bg-base-100 rounded-lg border border-base-300 shadow-sm h-8 items-center overflow-hidden">
        <div className="flex-1 min-w-0">
          <input
            type="date"
            className="input input-ghost input-sm focus:bg-transparent h-full w-full px-2 outline-none border-none text-[11px] md:text-xs appearance-none"
            value={fromDate || ""}
            onChange={(e) => onChange({ fromDate: e.target.value })}
          />
        </div>

        <span className="opacity-20 font-light shrink-0">|</span>

        <div className="flex-1 min-w-0">
          <input
            type="date"
            className="input input-ghost input-sm focus:bg-transparent h-full w-full px-2 outline-none border-none text-[11px] md:text-xs appearance-none"
            value={toDate || ""}
            onChange={(e) => onChange({ toDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

export default DateRangeInput
