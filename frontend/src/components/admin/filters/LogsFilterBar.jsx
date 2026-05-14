import React from "react"
import { AUDIT_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import { formatDateDisplay } from "@/utils/utils"
import FilterPill from "./FilterPill"
import DateRangeInput from "./DateRangeInput"
import DynamicSearch from "./DynamicSearch"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"

const LogsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()

  const handleAddFilter = (field, value) => {
    const currentFilters = filters.filters || []
    const existingIndex = currentFilters.findIndex((f) => f.field === field)

    let updatedFilters = [...currentFilters]
    if (existingIndex > -1) {
      if (!updatedFilters[existingIndex].values.includes(value)) {
        updatedFilters[existingIndex].values.push(value)
      }
    } else {
      updatedFilters.push({ field, values: [value] })
    }
    onChange({ filters: updatedFilters })
  }

  const removeFilter = (index) => {
    onChange({ filters: filters.filters.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      {/* Contenedor principal: Column en móvil, Row en Desktop */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <div className="flex-1">
          <DynamicSearch
            config={AUDIT_FILTER_CONFIG}
            onAddFilter={handleAddFilter}
            translationPath="adminPanel.logs.table"
          />
        </div>

        <div className="flex flex-row items-end gap-2">
          <div className="flex-1 md:flex-none">
            <DateRangeInput
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              onChange={onChange}
            />
          </div>

          <Button
            svg={<CloseSVG />}
            variant="ghost"
            size="sm"
            className="hover:text-error p-1 h-8 min-h-8 w-8"
            onClick={() => onChange({ filters: [], fromDate: "", toDate: "" })}
          />
        </div>
      </div>

      {(filters.filters?.length > 0 || filters.fromDate || filters.toDate) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 md:p-3 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.fromDate && (
            <FilterPill
              label={t("ui.tables.filters.from")}
              value={formatDateDisplay(filters.fromDate)}
              onRemove={() => onChange({ fromDate: "" })}
            />
          )}
          {filters.toDate && (
            <FilterPill
              label={t("ui.tables.filters.to")}
              value={formatDateDisplay(filters.toDate)}
              onRemove={() => onChange({ toDate: "" })}
            />
          )}
          {filters.filters?.map((f, i) => (
            <FilterPill
              key={i}
              label={t(`adminPanel.logs.table.${f.field}`) || f.field}
              value={f.values.join(", ")}
              onRemove={() => removeFilter(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LogsFilterBar
