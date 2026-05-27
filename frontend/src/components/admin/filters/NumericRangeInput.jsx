import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const NumericRangeInput = ({
  minValue,
  maxValue,
  onChange,
  name,
  translationPath,
}) => {
  const { t } = useLocale()

  return (
    <div className="flex flex-col w-full">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {t("ui.tables.filters.range")} (
          {t(`${translationPath}.${name.toLowerCase()}`) || name})
        </span>
      </label>

      <div className="flex items-stretch w-full gap-1">
        <input
          type="number"
          placeholder={t("ui.tables.filters.min")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0"
          value={minValue || ""}
          onChange={(e) => onChange({ [`min${name}`]: e.target.value })}
        />
        <span className="flex opacity-50 font-light shrink-0 items-center">
          |
        </span>
        <div className="sm:hidden h-px bg-base-300/60 mx-2" />
        <input
          type="number"
          placeholder={t("ui.tables.filters.max")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0"
          value={maxValue || ""}
          onChange={(e) => onChange({ [`max${name}`]: e.target.value })}
        />
      </div>
    </div>
  )
}

export default NumericRangeInput
