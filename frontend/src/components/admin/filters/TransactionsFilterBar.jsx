import React, { useEffect, useMemo, useState } from "react"
import { TRANSACTION_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import FilterPill from "./FilterPill"
import DynamicSearch from "./DynamicSearch"
import NumericRangeInput from "./NumericRangeInput"
import DateRangeInput from "./DateRangeInput"
import { formatDateDisplay } from "@/utils/utils"

const TransactionsFilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [selectedField, setSelectedField] = useState(
    Object.keys(TRANSACTION_FILTER_CONFIG)[0] || "",
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

    const nextFilters = { ...draftFilters, filters: nextAppliedFilters }
    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  const resetAll = () => {
    const nextFilters = {
      ...draftFilters,
      type: "",
      amount: "",
      minAmount: "",
      maxAmount: "",
      fromDate: "",
      toDate: "",
      filters: [],
    }

    setDraftFilters(nextFilters)
    setSelectedValue("")
    onChange(nextFilters)
  }

  return (
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <DynamicSearch
        config={TRANSACTION_FILTER_CONFIG}
        selectedField={selectedField}
        selectedValue={selectedValue}
        onFieldChange={(value) => {
          setSelectedField(value)
          setSelectedValue("")
        }}
        onValueChange={setSelectedValue}
        onSubmit={handleSubmit}
        onReset={resetAll}
        translationPath="adminPanel.userDetails.transactions.table">
        <DateRangeInput
          fromDate={draftFilters.fromDate}
          toDate={draftFilters.toDate}
          onChange={(value) =>
            setDraftFilters((prev) => ({ ...prev, ...value }))
          }
        />
        <NumericRangeInput
          name="Amount"
          minValue={draftFilters.minAmount}
          maxValue={draftFilters.maxAmount}
          onChange={(value) =>
            setDraftFilters((prev) => ({ ...prev, ...value }))
          }
          translationPath="adminPanel.userDetails.transactions.table"
        />
      </DynamicSearch>

      {/* Pills de visualización */}
      {(appliedFilters.length > 0 ||
        filters.minAmount ||
        filters.maxAmount ||
        filters.fromDate ||
        filters.toDate) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.minAmount && (
            <FilterPill
              label={t("adminPanel.userDetails.transactions.table.minAmount")}
              value={filters.minAmount}
              onRemove={() =>
                removeAppliedFilter({ minAmount: "" })
              }
            />
          )}
          {filters.maxAmount && (
            <FilterPill
              label={t("adminPanel.userDetails.transactions.table.maxAmount")}
              value={filters.maxAmount}
              onRemove={() =>
                removeAppliedFilter({ maxAmount: "" })
              }
            />
          )}
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
              label={t(`adminPanel.userDetails.transactions.table.${f.field}`) || f.field}
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

export default TransactionsFilterBar
