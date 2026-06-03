import React from "react"
import {
  IconArrowBackUp,
  IconMultiplier2x,
  IconPlayCard,
  IconRepeat,
} from "@tabler/icons-react"
import Button from "../buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const BettingBtns = ({ children, actions, disabled, compact = false }) => {
  const { repeat, clear, double, start } = actions
  const { t } = useLocale()
  const disabledMap =
    typeof disabled === "object" && disabled !== null ? disabled : {}
  const isAllDisabled =
    typeof disabled === "boolean" ? disabled : Boolean(disabledMap.all)
  const isDisabled = (action) => isAllDisabled || Boolean(disabledMap[action])
  const startLabel = actions.startLabel ?? "games.actions.bet"
  const startSvg = actions.startSvg ?? <IconPlayCard />
  const rootClassName = compact
    ? "flex flex-wrap gap-2 w-full md:gap-4"
    : "flex flex-wrap gap-4 w-full"
  const buttonClassName = compact
    ? "flex-1 basis-0 min-w-fit h-10 min-h-10 md:h-11 md:min-h-11 lg:h-auto lg:min-h-12"
    : "flex-1 basis-0 min-w-fit"
  const startButtonClassName = compact
    ? "min-w-fit w-full h-11 min-h-10 md:h-10 md:min-h-11 lg:h-auto lg:min-h-12"
    : "min-w-fit w-full"

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
