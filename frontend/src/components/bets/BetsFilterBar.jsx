import React, { useEffect, useState } from "react"
import DateRangeInput from "@/components/admin/filters/DateRangeInput"
import DynamicSearch from "@/components/admin/filters/DynamicSearch"
import FilterPill from "@/components/admin/filters/FilterPill"
import { PUBLIC_BET_FILTER_CONFIG } from "@/components/admin/filters/adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import { formatDateDisplay } from "@/utils/utils"

const BetsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [selectedField, setSelectedField] = useState(
    Object.keys(PUBLIC_BET_FILTER_CONFIG)[0] || "",
  )
  const [selectedValue, setSelectedValue] = useState("")

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  const removeAppliedFilter = (nextPartialFilters) => {
    const nextFilters = { ...filters, ...nextPartialFilters }
    setDraftFilters(nextFilters)
    onChange(nextFilters)
  }

  const handleSubmit = () => {
    const nextFilters = {
      ...draftFilters,
    }

    if (selectedField) {
      nextFilters[selectedField] = selectedValue
    }

    setDraftFilters(nextFilters)
    onChange(nextFilters)
  }

  const resetFilters = () => {
    const nextFilters = {
      name: "",
      status: "",
      fromEndsAt: "",
      toEndsAt: "",
    }

    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const handleEndsAtChange = (value) => {
    const mappedValue = {}

    if (Object.prototype.hasOwnProperty.call(value, "fromDate")) {
      mappedValue.fromEndsAt = value.fromDate
    }

    if (Object.prototype.hasOwnProperty.call(value, "toDate")) {
      mappedValue.toEndsAt = value.toDate
    }

    setDraftFilters((prev) => ({ ...prev, ...mappedValue }))
  }

  return (
    <div className="rounded-xl border border-base-300 bg-base-200 p-3 md:p-4">
      <DynamicSearch
        config={PUBLIC_BET_FILTER_CONFIG}
        selectedField={selectedField}
        selectedValue={selectedValue}
        onFieldChange={(value) => {
          setSelectedField(value)
          setSelectedValue(draftFilters[value] || "")
        }}
        onValueChange={(value) => {
          setSelectedValue(value)
          setDraftFilters((prev) => ({
            ...prev,
            [selectedField]: value,
          }))
        }}
        onSubmit={handleSubmit}
        onReset={resetFilters}
        translationPath="pages.bets.filters"
      >
        <DateRangeInput
          fromDate={draftFilters.fromEndsAt}
          toDate={draftFilters.toEndsAt}
          onChange={handleEndsAtChange}
          label={t("pages.bets.card.endsAt")}
        />
      </DynamicSearch>

      {(filters.name || filters.status || filters.fromEndsAt || filters.toEndsAt) && (
        <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-base-300/50 bg-base-300/30 p-2">
          {filters.name && (
            <FilterPill
              label={t("adminPanel.bets.table.name")}
              value={filters.name}
              onRemove={() => removeAppliedFilter({ name: "" })}
            />
          )}

          {filters.status && (
            <FilterPill
              label={t("pages.bets.filters.status")}
              value={t(`pages.bets.status.${filters.status}`)}
              isEnum
              onRemove={() => removeAppliedFilter({ status: "" })}
            />
          )}

          {filters.fromEndsAt && (
            <FilterPill
              label={`${t("pages.bets.card.endsAt")} ${t("ui.tables.filters.from")}`}
              value={formatDateDisplay(filters.fromEndsAt)}
              onRemove={() => removeAppliedFilter({ fromEndsAt: "" })}
            />
          )}

          {filters.toEndsAt && (
            <FilterPill
              label={`${t("pages.bets.card.endsAt")} ${t("ui.tables.filters.to")}`}
              value={formatDateDisplay(filters.toEndsAt)}
              onRemove={() => removeAppliedFilter({ toEndsAt: "" })}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default BetsFilterBar
