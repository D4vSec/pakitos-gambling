import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import { AUDIT_TYPES } from "../types"

const FilterBar = ({ filters, onChange }) => {
  const { t } = useLocale()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "action" && value !== "GAME_RESULT") {
      onChange({
        action: value,
        result: "",
      })
      return
    }

    onChange({ [name]: value })
  }

  const isGameResultActive = filters.action === "GAME_RESULT"

  const clearFilters = () => {
    onChange({
      userId: "",
      action: "",
      result: "",
      fromDate: "",
      toDate: "",
    })
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg flex flex-wrap gap-4 items-end">
      <div className="form-control w-full md:w-auto flex-1">
        <label className="label pt-0">
          <span className="label-text font-bold">
            {t("ui.tables.filters.userIdLabel") || "User UUID"}
          </span>
        </label>
        <input
          type="text"
          name="userId"
          value={filters.userId}
          onChange={handleInputChange}
          placeholder="00000000-0000-0000-0000-000000000000"
          className="input input-bordered w-full "
          maxLength={36}
        />
      </div>

      <div className="form-control w-full md:w-48">
        <label className="label pt-0">
          <span className="label-text font-bold">{t("ui.tables.filters.action")}</span>
        </label>
        <select
          name="action"
          value={filters.action}
          onChange={handleInputChange}
          className="select select-bordered"
        >
          <option value="">{t("ui.tables.filters.allActions")}</option>
          {AUDIT_TYPES.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full md:w-40">
        <label className="label pt-0 flex justify-between">
          <span className="label-text font-bold">{t("ui.tables.filters.result")}</span>
        </label>
        <select
          name="result"
          value={filters.result}
          onChange={handleInputChange}
          disabled={!isGameResultActive}
          className={`select select-bordered ${!isGameResultActive ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <option value="">{t("ui.tables.filters.all")}</option>
          <option value="win">{t("ui.tables.filters.won")}</option>
          <option value="lose">{t("ui.tables.filters.lost")}</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label pt-0">
          <span className="label-text font-bold">{t("ui.tables.filters.dateRange")}</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleInputChange}
            className="input input-bordered"
          />
          <span>-</span>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleInputChange}
            className="input input-bordered"
          />
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="btn btn-ghost btn-square"
        title={t("ui.tables.filters.clear")}
      >
        <CloseSVG className="w-5 h-5" />
      </button>
    </div>
  )
}

export default FilterBar
