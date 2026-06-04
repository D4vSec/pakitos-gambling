import Button from "@/components/buttons/Button"
import React from "react"
import { useBlackjack } from "@/providers/BlackjackProvider"
import { GAME_ACTION_BUTTON_FLEX_CLASS } from "../../gameControlClasses"

import { useLocale } from "@/providers/LocaleProvider"
import {
  IconArrowsSplit,
  IconCards,
  IconHandStop,
  IconMultiplier2x,
  IconPlayCard,
} from "@tabler/icons-react"

const BlackjackActions = ({ disabled }) => {
  const { game, hit, stand, double, split } = useBlackjack()
  const { t } = useLocale()

  const buttons = [
    {
      label: "games.blackjack.actions.hit",
      variant: "primary",
      svg: <IconPlayCard />,
      onClick: hit,
    },
    {
      label: "games.blackjack.actions.stand",
      variant: "secondary",
      svg: <IconHandStop />,
      onClick: stand,
    },
    {
      label: "games.blackjack.actions.split",
      variant: "neutral",
      onClick: split,
      svg: <IconArrowsSplit />,
      disabled: Boolean(game?.split),
    },
    {
      label: "games.blackjack.actions.double",
      variant: "accent",
      svg: <IconMultiplier2x />,
      onClick: double,
    },
  ]
  return (
    <div className="w-full grid grid-cols-2 grid-row-2 gap-2">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          type="button"
          variant={btn.variant}
          className={GAME_ACTION_BUTTON_FLEX_CLASS}
          onClick={btn.onClick}
          svg={btn.svg ?? <></>}
          disabled={disabled || btn.disabled}>
          {t(btn.label)}
        </Button>
      ))}
    </div>
  )
}

export default BlackjackActions
