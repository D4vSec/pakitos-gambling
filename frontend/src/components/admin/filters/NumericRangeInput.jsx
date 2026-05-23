import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const NumericRangeInput = ({ minValue, maxValue, onChange, name, translationPath }) => {
  const { t } = useLocale()

  return (
    <div className="flex flex-col w-full">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {t("ui.tables.filters.range")} ({t(`${translationPath}.${name.toLowerCase()}`) || name})
        </span>
      </label>

      <div className="flex bg-base-100 rounded-lg border border-base-300 shadow-sm h-8 items-center overflow-hidden">
        <input
          type="number"
          placeholder={t("ui.tables.filters.min")}
          className="input input-ghost input-sm focus:bg-transparent h-full w-full px-2 outline-none border-none text-xs"
          value={minValue || ""}
          onChange={(e) => onChange({ [`min${name}`]: e.target.value })}
        />
        <span className="opacity-20 font-light shrink-0">|</span>
        <input
          type="number"
          placeholder={t("ui.tables.filters.max")}
          className="input input-ghost input-sm focus:bg-transparent h-full w-full px-2 outline-none border-none text-xs"
          value={maxValue || ""}
          onChange={(e) => onChange({ [`max${name}`]: e.target.value })}
        />
      </div>
    </div>
  )
}

export default NumericRangeInput
