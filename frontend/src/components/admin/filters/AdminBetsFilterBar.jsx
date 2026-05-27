import React, { useEffect, useMemo, useState } from "react"
import { ADMIN_BET_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import { formatDateDisplay } from "@/utils/utils"
import FilterPill from "./FilterPill"
import DateRangeInput from "./DateRangeInput"
import DynamicSearch from "./DynamicSearch"

const AdminBetsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [selectedField, setSelectedField] = useState(
    Object.keys(ADMIN_BET_FILTER_CONFIG)[0] || "",
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
    const nextAppliedFilters = [...appliedFilters]

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

    const nextDraftFilters = { ...draftFilters, filters: nextAppliedFilters }
    setDraftFilters(nextDraftFilters)
    setSelectedValue("")
    onChange(nextDraftFilters)
  }

  const resetAll = () => {
    const nextFilters = {
      ...draftFilters,
      filters: [],
      fromEndsAt: "",
      toEndsAt: "",
      fromCreatedAt: "",
      toCreatedAt: "",
    }
    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const handleEndsAtChange = (value) => {
    const mappedValue = {}
    if (Object.prototype.hasOwnProperty.call(value, "fromDate"))
      mappedValue.fromEndsAt = value.fromDate
    if (Object.prototype.hasOwnProperty.call(value, "toDate"))
      mappedValue.toEndsAt = value.toDate
    setDraftFilters((prev) => ({ ...prev, ...mappedValue }))
  }

  const handleCreatedAtChange = (value) => {
    const mappedValue = {}
    if (Object.prototype.hasOwnProperty.call(value, "fromDate"))
      mappedValue.fromCreatedAt = value.fromDate
    if (Object.prototype.hasOwnProperty.call(value, "toDate"))
      mappedValue.toCreatedAt = value.toDate
    setDraftFilters((prev) => ({ ...prev, ...mappedValue }))
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-200 p-3 md:p-4">
      <DynamicSearch
        config={ADMIN_BET_FILTER_CONFIG}
        selectedField={selectedField}
        selectedValue={selectedValue}
        onFieldChange={(value) => {
          setSelectedField(value)
          setSelectedValue("")
        }}
        onValueChange={setSelectedValue}
        onSubmit={handleSubmit}
        onReset={resetAll}
        translationPath="adminPanel.bets.table">
        <DateRangeInput
          fromDate={draftFilters.fromEndsAt}
          toDate={draftFilters.toEndsAt}
          onChange={handleEndsAtChange}
          label={t("adminPanel.bets.table.ends_at")}
        />
        <DateRangeInput
          fromDate={draftFilters.fromCreatedAt}
          toDate={draftFilters.toCreatedAt}
          onChange={handleCreatedAtChange}
          label={t("adminPanel.bets.table.created_at")}
        />
      </DynamicSearch>

      {(appliedFilters.length > 0 ||
        filters.fromEndsAt ||
        filters.toEndsAt ||
        filters.fromCreatedAt ||
        filters.toCreatedAt) && (
        <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-base-300/50 bg-base-300/30 p-2 md:p-3">
          {filters.fromEndsAt && (
            <FilterPill
              label={`${t("adminPanel.bets.table.ends_at")} ${t("ui.tables.filters.from")}`}
              value={formatDateDisplay(filters.fromEndsAt)}
              onRemove={() =>
                removeAppliedFilter({ fromEndsAt: "" })
              }
            />
          )}
          {filters.toEndsAt && (
            <FilterPill
              label={`${t("adminPanel.bets.table.ends_at")} ${t("ui.tables.filters.to")}`}
              value={formatDateDisplay(filters.toEndsAt)}
              onRemove={() =>
                removeAppliedFilter({ toEndsAt: "" })
              }
            />
          )}
          {filters.fromCreatedAt && (
            <FilterPill
              label={`${t("adminPanel.bets.table.created_at")} ${t("ui.tables.filters.from")}`}
              value={formatDateDisplay(filters.fromCreatedAt)}
              onRemove={() =>
                removeAppliedFilter({ fromCreatedAt: "" })
              }
            />
          )}
          {filters.toCreatedAt && (
            <FilterPill
              label={`${t("adminPanel.bets.table.created_at")} ${t("ui.tables.filters.to")}`}
              value={formatDateDisplay(filters.toCreatedAt)}
              onRemove={() =>
                removeAppliedFilter({ toCreatedAt: "" })
              }
            />
          )}
          {appliedFilters.map((filter, index) => (
            <FilterPill
              key={`${filter.field}-${index}`}
              label={t(
                ADMIN_BET_FILTER_CONFIG[filter.field]?.labelKey ||
                  `adminPanel.bets.table.${filter.field}`,
              )}
              value={
                filter.field === "status"
                  ? filter.values
                      .map((value) => t(`pages.bets.status.${value}`))
                      .join(", ")
                  : filter.values.join(", ")
              }
              onRemove={() =>
                removeAppliedFilter({
                  filters: appliedFilters.filter(
                    (_, filterIndex) => filterIndex !== index,
                  ),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBetsFilterBar
