import React from "react"
import { BET_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import DynamicSearch from "./DynamicSearch"
import FilterPill from "./FilterPill"

const BetsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()

  const handleAddFilter = (field, value) => {
    const currentFilters = filters.filters || []
    const updatedFilters = [...currentFilters]
    const existingIndex = updatedFilters.findIndex((filter) => filter.field === field)

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
    <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-200 p-3 md:p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
        <div className="flex-1">
          <DynamicSearch
            config={BET_FILTER_CONFIG}
            onAddFilter={handleAddFilter}
            translationPath="adminPanel.bets.table"
          />
        </div>

        <Button
          type="button"
          svg={<CloseSVG />}
          variant="ghost"
          size="sm"
          className="hover:text-error h-8 w-8 min-h-8 p-1"
          onClick={() => onChange({ filters: [] })}
        />
      </div>

      {filters.filters?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 rounded-lg border border-base-300/50 bg-base-300/30 p-2">
          {filters.filters.map((filter, index) => (
            <FilterPill
              key={`${filter.field}-${index}`}
              label={t(`adminPanel.bets.table.${filter.field}`)}
              value={filter.values.join(", ")}
              onRemove={() => {
                const nextFilters = filters.filters.filter((_, filterIndex) => filterIndex !== index)
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
