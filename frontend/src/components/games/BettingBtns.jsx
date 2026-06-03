import React from "react"
import {
  IconArrowBackUp,
  IconMultiplier2x,
  IconRepeat,
  IconTriangle,
} from "@tabler/icons-react"
import Button from "../buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import {
  GAME_ACTION_BUTTON_BASIS_CLASS,
  GAME_ACTION_BUTTON_FULL_CLASS,
} from "./gameControlClasses"

const BettingBtns = ({ children, actions, disabled }) => {
  const { repeat, clear, double, start } = actions
  const { t } = useLocale()
  const disabledMap =
    typeof disabled === "object" && disabled !== null ? disabled : {}
  const isAllDisabled =
    typeof disabled === "boolean" ? disabled : Boolean(disabledMap.all)
  const isDisabled = (action) => isAllDisabled || Boolean(disabledMap[action])
  const startLabel = actions.startLabel ?? "games.actions.bet"
  const startSvg = actions.startSvg ?? (
    <IconTriangle className="rotate-90 scale-75 stroke-2" />
  )
  const rootClassName = "flex w-full flex-wrap gap-2 md:gap-4"
  const buttonClassName = GAME_ACTION_BUTTON_BASIS_CLASS
  const startButtonClassName = GAME_ACTION_BUTTON_FULL_CLASS

  return (
    <div className={rootClassName}>
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          variant="primary"
          className={buttonClassName}
          svg={<IconRepeat />}
          onClick={repeat}
          disabled={isDisabled("repeat")}>
          <span className="hidden sm:flex">{t("games.actions.repeatBet")}</span>
        </Button>

        <Button
          variant="primary"
          className={buttonClassName}
          onClick={double}
          svg={
            <span className="scale-125">
              <IconMultiplier2x />
            </span>
          }
          disabled={isDisabled("double")}>
          <span className="hidden sm:flex">{t("games.actions.doubleBet")}</span>
        </Button>

        <Button
          variant="primary"
          className={buttonClassName}
          onClick={clear}
          svg={<IconArrowBackUp />}
          disabled={isDisabled("clear")}>
          <span className="hidden sm:flex">{t("games.actions.clearBet")}</span>
        </Button>
      </div>

      {children}

      <Button
        variant="secondary"
        className={startButtonClassName}
        svg={startSvg}
        onClick={start}
        disabled={isDisabled("start")}>
        {t(startLabel)}
      </Button>
    </div>
  )
}

export default BettingBtns
