import React from "react"
import Button from "../buttons/Button"
import ReloadSVG from "../svg/pictures/ReloadSVG"
import { useLocale } from "@/providers/LocaleProvider"

const BettingBtns = ({ children, actions, disabled }) => {
  const { repeat, clear, double, start } = actions
  const { t } = useLocale()
  return (
    <div className="flex flex-wrap gap-4 w-full">
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          variant="primary"
          className="flex-1 basis-0 min-w-fit"
          svg={<ReloadSVG />}
          onClick={repeat}
          disabled={disabled}>
          {t("games.actions.repeatBet")}
        </Button>

        <Button
          variant="primary"
          className="flex-1 basis-0 min-w-fit"
          onClick={double}
          disabled={disabled}>
          {t("games.actions.doubleBet")}
        </Button>

        <Button
          variant="primary"
          className="w-full"
          onClick={clear}
          disabled={disabled}>
          {t("games.actions.clearBet")}
        </Button>
      </div>
      {children}
      <Button
        variant="secondary"
        className="min-w-fit w-full"
        onClick={start}
        disabled={disabled}>
        {t("games.actions.bet")}
      </Button>
    </div>
  )
}

export default BettingBtns
