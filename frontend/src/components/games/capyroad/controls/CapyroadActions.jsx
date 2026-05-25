import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const CapyroadActions = ({
  disabled,
  canCashout = false,
  onCross,
  onCashout,
}) => {
  const { t } = useLocale()

  const buttons = [
    {
      label: "games.capyroad.actions.cross",
      onClick: onCross,
      variant: "neutral",
    },
    {
      label: "games.capyroad.actions.cashout",
      onClick: onCashout,
      variant: "primary",
      disabled: !canCashout,
    },
  ]

  return (
    <div className="w-full grid grid-cols-1 grid-row-2 gap-2">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          variant={btn.variant}
          className="flex-1 min-w-fit"
          onClick={btn.onClick}
          disabled={disabled || btn.disabled}>
          {t(btn.label)}
        </Button>
      ))}
    </div>
  )
}

export default CapyroadActions
