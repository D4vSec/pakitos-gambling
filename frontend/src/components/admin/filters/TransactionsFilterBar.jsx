import React from "react"
import { TRANSACTION_FILTER_CONFIG } from "./adminFilters"
import { useLocale } from "@/providers/LocaleProvider"
import FilterPill from "./FilterPill"
import DynamicSearch from "./DynamicSearch"
import NumericRangeInput from "./NumericRangeInput"
import DateRangeInput from "./DateRangeInput"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import { formatDateDisplay } from "@/utils/utils"

const TransactionsFilterBar = ({ filters, onChange }) => {
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

  const resetAll = () => {
    onChange({
      type: "",
      amount: "",
      minAmount: "",
      maxAmount: "",
      fromDate: "",
      toDate: "",
      filters: [],
    })
  }

  return (
    <div className="flex flex-col gap-3 bg-base-200 p-3 md:p-4 rounded-xl border border-base-300">
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-end">
        <div className="flex-2">
          <DynamicSearch
            config={TRANSACTION_FILTER_CONFIG}
            onAddFilter={handleAddFilter}
            translationPath="adminPanel.userDetails.transactions.table"
          />
        </div>

        <div className="flex-1">
          <NumericRangeInput
            name="Amount"
            minValue={filters.minAmount}
            maxValue={filters.maxAmount}
            onChange={onChange}
            translationPath="adminPanel.userDetails.transactions.table"
          />
        </div>

        <div className="flex-1">
          <DateRangeInput fromDate={filters.fromDate} toDate={filters.toDate} onChange={onChange} />
        </div>

        <Button
          svg={<CloseSVG />}
          variant="ghost"
          size="sm"
          className="hover:text-error h-8 w-8 min-h-8 p-1"
          onClick={resetAll}
        />
      </div>

      {/* Pills de visualización */}
      {(filters.filters?.length > 0 ||
        filters.minAmount ||
        filters.maxAmount ||
        filters.fromDate ||
        filters.toDate) && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-base-300/30 rounded-lg border border-base-300/50">
          {filters.minAmount && (
            <FilterPill
              label={t("adminPanel.userDetails.transactions.table.minAmount")}
              value={filters.minAmount}
              onRemove={() => onChange({ minAmount: "" })}
            />
          )}
          {filters.maxAmount && (
            <FilterPill
              label={t("adminPanel.userDetails.transactions.table.maxAmount")}
              value={filters.maxAmount}
              onRemove={() => onChange({ maxAmount: "" })}
            />
          )}
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
              label={t(`adminPanel.userDetails.transactions.table.${f.field}`) || f.field}
              value={f.values.join(", ")}
              onRemove={() => onChange({ filters: filters.filters.filter((_, idx) => idx !== i) })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionsFilterBar
