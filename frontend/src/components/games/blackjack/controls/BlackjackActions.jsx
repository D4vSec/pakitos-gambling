import Button from "@/components/buttons/Button"
import React from "react"
import { useBlackjack } from "@/providers/BlackjackProvider"

import { useLocale } from "@/providers/LocaleProvider"

const BlackjackActions = ({ disabled }) => {
  const { game, hit, stand, double, split } = useBlackjack()
  const { t } = useLocale()

  const buttons = [
    {
      label: "games.blackjack.actions.hit",
      onClick: hit,
    },
    {
      label: "games.blackjack.actions.stand",
      onClick: stand,
    },
    {
      label: "games.blackjack.actions.split",
      onClick: split,
      disabled: Boolean(game?.split),
    },
    {
      label: "games.blackjack.actions.double",
      onClick: double,
    },
  ]
  return (
    <div className="w-full grid grid-cols-2 grid-row-2 gap-2">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          variant="neutral"
          className="flex-1 min-w-fit"
          onClick={btn.onClick}
          disabled={disabled || btn.disabled}>
          {t(btn.label)}
        </Button>
      ))}
    </div>
  )
}

export default BlackjackActions
