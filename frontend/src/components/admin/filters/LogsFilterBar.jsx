import React, { useEffect, useMemo, useState } from "react"
import { AUDIT_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import { formatDateDisplay } from "@/utils/utils"
import FilterPill from "./FilterPill"
import DateRangeInput from "./DateRangeInput"
import DynamicSearch from "./DynamicSearch"

const LogsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [selectedField, setSelectedField] = useState(
    Object.keys(AUDIT_FILTER_CONFIG)[0] || "",
  )
  const [selectedValue, setSelectedValue] = useState("")

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  const appliedFilters = useMemo(
    () => (Array.isArray(filters.filters) ? filters.filters : []),
    [filters.filters],
  )

  const removeAppliedFilter = (nextPartialFilters) => {
    const nextFilters = { ...filters, ...nextPartialFilters }
    setDraftFilters(nextFilters)
    onChange(nextFilters)
  }

  const getFilterValueLabel = (field, value) => {
    const optionLabelPrefix = AUDIT_FILTER_CONFIG[field]?.optionLabelPrefix
    return optionLabelPrefix ? t(`${optionLabelPrefix}.${value}`) : value
  }

  const handleSubmit = () => {
    let nextAppliedFilters = [...appliedFilters]

    if (selectedField && selectedValue) {
      const existingIndex = nextAppliedFilters.findIndex(
        (filter) => filter.field === selectedField,
      )

      if (existingIndex > -1) {
        if (!nextAppliedFilters[existingIndex].values.includes(selectedValue)) {
          nextAppliedFilters[existingIndex].values.push(selectedValue)
        }
      } else {
        nextAppliedFilters.push({ field: selectedField, values: [selectedValue] })
      }
    }

    const nextFilters = { ...draftFilters, filters: nextAppliedFilters }
    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const handleReset = () => {
    const nextFilters = {
      ...draftFilters,
      filters: [],
      fromDate: "",
      toDate: "",
    }
    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  return (
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <DynamicSearch
        config={AUDIT_FILTER_CONFIG}
        selectedField={selectedField}
        selectedValue={selectedValue}
        onFieldChange={(value) => {
          setSelectedField(value)
          setSelectedValue("")
        }}
        onValueChange={setSelectedValue}
        onSubmit={handleSubmit}
        onReset={handleReset}
        translationPath="adminPanel.logs.table">
        <DateRangeInput
          fromDate={draftFilters.fromDate}
          toDate={draftFilters.toDate}
          onChange={(value) =>
            setDraftFilters((prev) => ({ ...prev, ...value }))
          }
        />
      </DynamicSearch>

      {(appliedFilters.length > 0 ||
        filters.fromDate ||
        filters.toDate) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 md:p-3 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.fromDate && (
            <FilterPill
              label={t("ui.tables.filters.from")}
              value={formatDateDisplay(filters.fromDate)}
              onRemove={() =>
                removeAppliedFilter({ fromDate: "" })
              }
            />
          )}
          {filters.toDate && (
            <FilterPill
              label={t("ui.tables.filters.to")}
              value={formatDateDisplay(filters.toDate)}
              onRemove={() =>
                removeAppliedFilter({ toDate: "" })
              }
            />
          )}
          {appliedFilters.map((f, i) => (
            <FilterPill
              key={i}
              label={t(`adminPanel.logs.table.${f.field}`) || f.field}
              value={f.values.map((value) => getFilterValueLabel(f.field, value)).join(", ")}
              isEnum={AUDIT_FILTER_CONFIG[f.field]?.type === "enum"}
              onRemove={() =>
                removeAppliedFilter({
                  filters: appliedFilters.filter((_, idx) => idx !== i),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LogsFilterBar
