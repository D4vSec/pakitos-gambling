import React, { useState } from "react"
import { useLocale } from "@/providers/LocaleProvider"
import SearchSVG from "@/components/svg/actions/SearchSVG"

const DynamicSearch = ({ config, onAddFilter, translationPath }) => {
  const { t } = useLocale()
  const [localField, setLocalField] = useState("")
  const [localValue, setLocalValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!localField || !localValue) return
    onAddFilter(localField, localValue)
    setLocalValue("")
  }

  const selectedConfig = config[localField]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <label className="label pt-0 px-1 min-h-6">
        <span className="label-text font-bold text-sm">
          {t("ui.tables.filters.quickSearch")}
        </span>
      </label>

      <div className="join w-full shadow-sm h-8">
        <select
          className="select select-bordered select-sm join-item bg-base-100 h-full w-27.5 md:w-auto"
          value={localField}
          onChange={(e) => {
            setLocalField(e.target.value)
            setLocalValue("")
          }}>
          <option value="">{t("ui.tables.filters.searchBy")}</option>
          {Object.keys(config).map((key) => (
            <option key={key} value={key} className="text-xs md:text-sm">
              {t(`${translationPath}.${key}`) || key}
            </option>
          ))}
        </select>

        {selectedConfig?.type === "enum" ? (
          <select
            className="select select-bordered select-sm join-item flex-1 bg-base-100 h-full min-w-0"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            disabled={!localField}>
            <option value="">{t("ui.tables.filters.select")}</option>
            {selectedConfig.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="input input-bordered input-sm join-item flex-1 bg-base-100 h-full min-w-0"
            placeholder={localField ? t("ui.tables.filters.pressEnter") : "---"}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            disabled={!localField}
          />
        )}

        <button
          type="submit"
          className="btn btn-primary btn-sm join-item h-full px-2 md:px-4"
          disabled={!localValue}>
          <SearchSVG className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

export default DynamicSearch
