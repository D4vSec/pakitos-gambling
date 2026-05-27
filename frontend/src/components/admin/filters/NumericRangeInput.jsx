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
    <div className="flex w-full flex-col gap-2">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {t("ui.tables.filters.range")} (
          {t(`${translationPath}.${name.toLowerCase()}`) || name})
        </span>
      </label>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <input
          type="number"
          placeholder={t("ui.tables.filters.min")}
          aria-label={t("ui.tables.filters.min")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0"
          value={minValue || ""}
          onChange={(e) => onChange({ [`min${name}`]: e.target.value })}
        />
        <span className="hidden opacity-50 font-light sm:flex sm:items-center sm:justify-center">
          |
        </span>
        <input
          type="number"
          placeholder={t("ui.tables.filters.max")}
          aria-label={t("ui.tables.filters.max")}
          className="input input-bordered input-md bg-base-100 w-full min-w-0"
          value={maxValue || ""}
          onChange={(e) => onChange({ [`max${name}`]: e.target.value })}
        />
      </div>
    </div>
  )
}

export default NumericRangeInput
