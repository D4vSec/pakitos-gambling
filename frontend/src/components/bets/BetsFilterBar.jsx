import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const BetsFilterBar = ({ filters, onChange, onApply, onReset }) => {
  const { t } = useLocale()

  return (
    <div className="rounded-3xl border border-base-300 bg-base-200 p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="floating-label flex-1">
          <span>{t("pages.bets.filters.search")}</span>
          <input
            type="text"
            className="input input-lg w-full"
            value={filters.name}
            placeholder={t("pages.bets.filters.searchPlaceholder")}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </label>

        <label className="floating-label w-full lg:w-64">
          <span>{t("pages.bets.filters.status")}</span>
          <select
            className="select select-lg w-full"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}>
            <option value="all">{t("pages.bets.filters.all")}</option>
            <option value="open">{t("pages.bets.status.open")}</option>
            <option value="closed">{t("pages.bets.status.closed")}</option>
          </select>
        </label>

        <div className="flex gap-2 lg:justify-end">
          <Button variant="secondary" onClick={onReset}>
            {t("pages.bets.filters.reset")}
          </Button>
          <Button onClick={onApply}>{t("pages.bets.filters.apply")}</Button>
        </div>
      </div>
    </div>
  )
}

export default BetsFilterBar
