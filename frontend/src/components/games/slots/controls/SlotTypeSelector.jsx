import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const SLOT_TYPES = ["3x3", "3x5", "5x5"]

const SlotTypeSelector = ({ type, onTypeChange, disabled }) => {
  const { t } = useLocale()

  return (
    <div className="flex flex-row items-center gap-2 md:flex-col md:items-stretch md:gap-1">
      <p className="fieldset-legend shrink-0 text-sm sm:text-md">
        {t("games.slots.controls.selectType")}:
      </p>
      <div className="flex min-w-0 flex-1 gap-2 md:w-full">
        {SLOT_TYPES.map((mode) => (
          <Button
            key={mode}
            type="button"
            size="md"
            variant={type === mode ? "primary" : "ghost"}
            className={`flex-1 btn-sm md:btn-md ${
              type === mode ? "" : "border border-base-content/20"
            }`}
            onClick={() => onTypeChange?.(mode)}
            disabled={disabled}>
            {mode}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SlotTypeSelector
