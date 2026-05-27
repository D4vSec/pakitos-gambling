import React, { useState } from "react"
import { useLocale } from "@/providers/LocaleProvider"
import SearchSVG from "@/components/svg/actions/SearchSVG"

// TODO: Traducir los enumerados???
const DynamicSearch = ({ config, onAddFilter, translationPath }) => {
  const { t } = useLocale()

  const [localField, setLocalField] = useState(Object.keys(config)[0])
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

      <div className="grid grid-cols-2 items-stretch gap-2 w-full sm:flex sm:flex-row">
        <select
          className="select select-bordered select-md bg-base-100 flex-1 sm:w-44 md:w-48 sm:shrink-0"
          value={localField}
          onChange={(e) => {
            setLocalField(e.target.value)
            setLocalValue("")
          }}>
          {Object.keys(config).length > 1 && (
            <option value="">{t("ui.tables.filters.searchBy")}</option>
          )}

          {Object.keys(config).map((key) => (
            <option key={key} value={key} className="text-xs sm:text-sm">
              {t(`${translationPath}.${key}`) || key}
            </option>
          ))}
        </select>

        {selectedConfig?.type === "enum" ? (
          <select
            className="select select-bordered select-md bg-base-100 w-full min-w-0 flex-2"
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
            className="input input-bordered input-md bg-base-100 w-full min-w-0 flex-2"
            placeholder={localField ? t("ui.tables.filters.pressEnter") : "---"}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            disabled={!localField}
          />
        )}

        <button
          type="submit"
          className="btn btn-primary btn-md col-span-2 w-full sm:w-auto sm:self-stretch sm:shrink-0"
          disabled={!localValue}>
          <SearchSVG className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

export default DynamicSearch
