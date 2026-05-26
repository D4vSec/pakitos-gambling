import React from "react"
import { BET_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import FilterPill from "./FilterPill"
import DynamicSearch from "./DynamicSearch"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"

const BetsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()

  const handleAddFilter = (field, value) => {
    const currentFilters = filters.filters || []
    const updatedFilters = [...currentFilters]
    const existingIndex = updatedFilters.findIndex(
      (filter) => filter.field === field,
    )

    if (existingIndex > -1) {
      if (!updatedFilters[existingIndex].values.includes(value)) {
        updatedFilters[existingIndex].values.push(value)
      }
    } else {
      updatedFilters.push({ field, values: [value] })
    }

    onChange({ filters: updatedFilters })
  }

  return (
    <div className="flex flex-col justify-center bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="min-w-0 w-full">
          <DynamicSearch
            config={BET_FILTER_CONFIG}
            onAddFilter={handleAddFilter}
            translationPath="adminPanel.bets.table"
          />
        </div>

        <div className="flex flex-row gap-3 items-end lg:w-100">
          <div className="min-w-0 w-full sm:flex-1">
            <label className="label pt-0 px-1 min-h-6">
              <span className="label-text font-bold text-sm">
                {t("pages.bets.filters.status")}
              </span>
            </label>

            <select
              className="select select-bordered select-md bg-base-100 w-full"
              value={filters.status || ""}
              onChange={(event) => onChange({ status: event.target.value })}>
              <option value="">{t("ui.tables.filters.all")}</option>
              <option value="open">{t("pages.bets.status.open")}</option>
              <option value="closed">{t("pages.bets.status.closed")}</option>
            </select>
          </div>

          <Button
            type="button"
            svg={<CloseSVG />}
            variant="ghost"
            size="sm"
            className="hover:text-error h-10 min-h-10 mb-0 md:mb-1 p-1 sm:h-8 sm:w-8 sm:min-h-8 sm:shrink-0"
            onClick={() => onChange({ filters: [], status: "" })}
          />
        </div>
      </div>

      {(filters.filters?.length > 0 || filters.status) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.status && (
            <FilterPill
              label={t("pages.bets.filters.status")}
              value={t(`pages.bets.status.${filters.status}`)}
              onRemove={() => onChange({ status: "" })}
            />
          )}

          {filters.filters?.map((filter, index) => (
            <FilterPill
              key={`${filter.field}-${index}`}
              label={t(`adminPanel.bets.table.${filter.field}`) || filter.field}
              value={filter.values.join(", ")}
              onRemove={() => {
                const nextFilters = filters.filters.filter(
                  (_, filterIndex) => filterIndex !== index,
                )

                onChange({ filters: nextFilters })
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BetsFilterBar
