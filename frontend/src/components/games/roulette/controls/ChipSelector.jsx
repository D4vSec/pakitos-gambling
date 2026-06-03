import React, { useMemo, useState } from "react"
import Chip from "../chips/Chip"
import { CHIPS } from "../rouletteConsts"
import { useLocale } from "@/providers/LocaleProvider"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

const MOBILE_CHIPS_PER_PAGE = 5

const ChipSelector = ({ selectedChip, setSelectedChip, disabled = false }) => {
  const { t } = useLocale()
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(CHIPS.length / MOBILE_CHIPS_PER_PAGE)
  const visibleChips = useMemo(() => {
    const start = page * MOBILE_CHIPS_PER_PAGE
    return CHIPS.slice(start, start + MOBILE_CHIPS_PER_PAGE)
  }, [page])

  const goToPreviousPage = () => {
    setPage((current) => (current - 1 + pageCount) % pageCount)
  }

  const goToNextPage = () => {
    setPage((current) => (current + 1) % pageCount)
  }

  const renderChip = (chip) => (
    <button
      key={chip.idSuffix}
      type="button"
      onClick={() => setSelectedChip(chip.value)}
      disabled={disabled}
      className={`cursor-pointer rounded-full border-2 p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-7 [&_svg]:w-7 md:[&_svg]:h-8 md:[&_svg]:w-8 ${
        selectedChip === chip.value ? "border-yellow-400" : "border-transparent"
      }`}
      aria-label={`${t("games.roulette.controls.chipValue")}: ${chip.value}`}>
      <Chip value={chip.value} />
    </button>
  )

  return (
    <div>
      <p className="fieldset-legend text-sm">
        {t("games.roulette.controls.chipValue")}: {selectedChip}
      </p>

      <div className="flex items-center justify-center gap-1 sm:hidden">
        <button
          type="button"
          className="btn btn-ghost btn-circle btn-xs shrink-0"
          onClick={goToPreviousPage}
          disabled={disabled}
          aria-label="Previous chips">
          <IconChevronLeft size={18} />
        </button>

        <div className="grid grid-cols-5 gap-1">{visibleChips.map(renderChip)}</div>

        <button
          type="button"
          className="btn btn-ghost btn-circle btn-xs shrink-0"
          onClick={goToNextPage}
          disabled={disabled}
          aria-label="Next chips">
          <IconChevronRight size={18} />
        </button>
      </div>

      <div className="hidden flex-wrap justify-center gap-2 sm:flex">
        {CHIPS.map(renderChip)}
      </div>
    </div>
  )
}

export default ChipSelector
