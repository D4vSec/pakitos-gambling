import React from "react"
import { USER_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import FilterPill from "./FilterPill"
import DynamicSearch from "./DynamicSearch"
import NumericRangeInput from "./NumericRangeInput"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"

const UsersFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()

  const handleAddFilter = (field, value) => {
    const currentFilters = filters.filters || []
    let updatedFilters = [...currentFilters]
    const existingIndex = updatedFilters.findIndex((f) => f.field === field)

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
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch xl:items-end">
        <div className="xl:col-span-6 min-w-0">
          <DynamicSearch
            config={USER_FILTER_CONFIG}
            onAddFilter={handleAddFilter}
            translationPath="adminPanel.users.table"
          />
        </div>

        <div className="xl:col-span-6 min-w-0 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 min-w-0">
            <NumericRangeInput
              name="Balance"
              minValue={filters.minBalance}
              maxValue={filters.maxBalance}
              onChange={onChange}
              translationPath="adminPanel.users.table"
            />
          </div>

          <Button
            svg={<CloseSVG />}
            variant="ghost"
            size="sm"
            className="hover:text-error h-10 w-full min-h-10 p-1 sm:h-8 sm:w-8 sm:min-h-8 sm:shrink-0"
            onClick={() => onChange({ filters: [], minBalance: "", maxBalance: "" })}
          />
        </div>
      </div>

      {(filters.filters?.length > 0 || filters.minBalance || filters.maxBalance) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.minBalance && (
            <FilterPill
              label={t("ui.tables.filters.minBalance")}
              value={filters.minBalance}
              onRemove={() => onChange({ minBalance: "" })}
            />
          )}
          {filters.maxBalance && (
            <FilterPill
              label={t("ui.tables.filters.maxBalance")}
              value={filters.maxBalance}
              onRemove={() => onChange({ maxBalance: "" })}
            />
          )}
          {filters.filters?.map((f, i) => (
            <FilterPill
              key={i}
              label={t(`adminPanel.users.table.${f.field}`) || f.field}
              value={f.values.join(", ")}
              onRemove={() => {
                const newFilters = filters.filters.filter((_, idx) => idx !== i)
                onChange({ filters: newFilters })
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersFilterBar
