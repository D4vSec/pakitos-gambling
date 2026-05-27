import React, { useEffect, useMemo, useState } from "react"
import { USER_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import FilterPill from "./FilterPill"
import DynamicSearch from "./DynamicSearch"
import NumericRangeInput from "./NumericRangeInput"

const UsersFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [selectedField, setSelectedField] = useState(
    Object.keys(USER_FILTER_CONFIG)[0] || "",
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

    const nextFilters = {
      ...draftFilters,
      filters: nextAppliedFilters,
    }

    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const handleReset = () => {
    const nextFilters = {
      ...draftFilters,
      filters: [],
      minBalance: "",
      maxBalance: "",
    }
    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const handleDraftChange = (value) => {
    setDraftFilters((prev) => ({ ...prev, ...value }))
  }

  return (
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <DynamicSearch
        config={USER_FILTER_CONFIG}
        selectedField={selectedField}
        selectedValue={selectedValue}
        onFieldChange={(value) => {
          setSelectedField(value)
          setSelectedValue("")
        }}
        onValueChange={setSelectedValue}
        onSubmit={handleSubmit}
        onReset={handleReset}
        translationPath="adminPanel.users.table">
        <NumericRangeInput
          name="Balance"
          minValue={draftFilters.minBalance}
          maxValue={draftFilters.maxBalance}
          onChange={handleDraftChange}
          translationPath="adminPanel.users.table"
        />
      </DynamicSearch>

      {(appliedFilters.length > 0 ||
        filters.minBalance ||
        filters.maxBalance) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.minBalance && (
            <FilterPill
              label={t("ui.tables.filters.minBalance")}
              value={filters.minBalance}
              onRemove={() =>
                removeAppliedFilter({ minBalance: "" })
              }
            />
          )}
          {filters.maxBalance && (
            <FilterPill
              label={t("ui.tables.filters.maxBalance")}
              value={filters.maxBalance}
              onRemove={() =>
                removeAppliedFilter({ maxBalance: "" })
              }
            />
          )}
          {appliedFilters.map((f, i) => (
            <FilterPill
              key={i}
              label={t(`adminPanel.users.table.${f.field}`) || f.field}
              value={f.values.join(", ")}
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

export default UsersFilterBar
