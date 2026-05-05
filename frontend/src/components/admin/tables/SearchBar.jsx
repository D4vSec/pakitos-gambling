import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import CloseSVG from "@/components/svg/actions/CloseSVG"

const SearchBar = ({ globalFilter, setGlobalFilter }) => {
  const { t } = useLocale()
  return (
    <div className="mb-3">
      <label className="floating-label w-full">
        <span>{t("ui.tables.searchBar.label")}</span>
        <div className="relative">
          <input
            className="input input-bordered input-lg w-full pr-10"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t("ui.tables.searchBar.placeholder")}
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:text-error transition-colors ">
              <CloseSVG className="w-4 h-4" />
            </button>
          )}
        </div>
      </label>
    </div>
  )
}

export default SearchBar
