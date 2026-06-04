import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { GAME_ACTION_BUTTON_FLEX_CLASS } from "../../gameControlClasses"
import {
  IconBounceRightFilled,
  IconCreditCardRefund,
} from "@tabler/icons-react"

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
      svg: <IconBounceRightFilled />,
      variant: "secondary",
    },
    {
      label: "games.capyroad.actions.cashout",
      onClick: onCashout,
      variant: "accent",
      svg: <IconCreditCardRefund />,
      disabled: !canCashout,
    },
  ]

  return (
    <div className="w-full grid grid-cols-1 grid-row-2 gap-2">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          type="button"
          variant={btn.variant}
          className={GAME_ACTION_BUTTON_FLEX_CLASS}
          onClick={btn.onClick}
          svg={btn.svg}
          disabled={disabled || btn.disabled}>
          {t(btn.label)}
        </Button>
      ))}
    </div>
  )
}

export default CapyroadActions
