import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import SearchSVG from "@/components/svg/actions/SearchSVG"
import CloseSVG from "@/components/svg/actions/CloseSVG"

const DynamicSearch = ({
  config,
  selectedField,
  selectedValue,
  onFieldChange,
  onValueChange,
  onSubmit,
  onReset,
  translationPath,
  showResetButton = true,
  children,
}) => {
  const { t } = useLocale()
  const childCount = React.Children.count(children)

  const layoutClassName =
    childCount === 0
      ? "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end"
      : childCount === 1
        ? "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)_auto] xl:items-end"
        : "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end"

  const searchControlsClassName =
    childCount === 0
      ? "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
      : "grid grid-cols-1 gap-2 sm:grid-cols-2"
  const childrenClassName =
    childCount <= 1
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2"

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.()
  }

  const selectedConfig = config[selectedField]
  const getFieldLabel = (key) => {
    const labelKey = config[key]?.labelKey
    return labelKey ? t(labelKey) : t(`${translationPath}.${key}`)
  }
  const getOptionLabel = (option) => {
    const optionLabelPrefix = selectedConfig?.optionLabelPrefix
    const label = optionLabelPrefix ? t(`${optionLabelPrefix}.${option}`) : option
    return typeof label === "string" ? label.toUpperCase() : label
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      <div className={layoutClassName}>
        <div className="flex w-full flex-col gap-2">
          <label className="label min-h-6 px-1 pt-0">
            <span className="label-text text-sm font-bold">
              {t("ui.tables.filters.quickSearch")}
            </span>
          </label>

          <div className={searchControlsClassName}>
            <select
              className="select select-bordered select-md bg-base-100 w-full"
              value={selectedField}
              onChange={(e) => onFieldChange?.(e.target.value)}>
              {Object.keys(config).length > 1 && (
                <option value="">{t("ui.tables.filters.searchBy")}</option>
              )}

              {Object.keys(config).map((key) => (
                <option key={key} value={key} className="text-xs sm:text-sm">
                  {getFieldLabel(key) || key}
                </option>
              ))}
            </select>

            {selectedConfig?.type === "enum" ? (
              <select
                className="select select-bordered select-md bg-base-100 w-full uppercase"
                value={selectedValue}
                onChange={(e) => onValueChange?.(e.target.value)}
                disabled={!selectedField}>
                <option value="">{t("ui.tables.filters.select")}</option>

                {selectedConfig.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {getOptionLabel(opt)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input input-bordered input-md bg-base-100 w-full min-w-0"
                placeholder={
                  selectedField ? t("ui.tables.filters.pressEnter") : "---"
                }
                value={selectedValue}
                onChange={(e) => onValueChange?.(e.target.value)}
                disabled={!selectedField}
              />
            )}
          </div>
        </div>

        {childCount > 0 && <div className={childrenClassName}>{children}</div>}

        <div className="grid grid-cols-2 gap-2 xl:flex xl:justify-end">
          <button
            type="submit"
            className="btn btn-secondary btn-md h-10 min-h-10 w-full xl:w-12 xl:min-w-10">
            <span>
              <SearchSVG />
            </span>
          </button>

          {onReset && showResetButton && (
            <button
              type="button"
              className="btn btn-primary btn-md  h-10 min-h-10 w-full xl:w-12 xl:min-w-10"
              onClick={onReset}>
              <span>
                <CloseSVG />
              </span>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default DynamicSearch
