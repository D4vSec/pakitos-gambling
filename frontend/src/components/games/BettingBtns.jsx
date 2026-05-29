import React from "react"
import { IconArrowBackUp, IconMultiplier2x, IconPlayCard, IconRepeat } from "@tabler/icons-react"
import Button from "../buttons/Button"
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
          svg={<IconRepeat />}
          onClick={repeat}
          disabled={disabled}
        >
          <span className="hidden sm:flex">{t("games.actions.repeatBet")}</span>
        </Button>

        <Button
          variant="primary"
          className="flex-1 basis-0 min-w-fit"
          onClick={double}
          svg={
            <span className="scale-125">
              <IconMultiplier2x />
            </span>
          }
          disabled={disabled}
        >
          <span className="hidden sm:flex">{t("games.actions.repeatBet")}</span>
        </Button>

        <Button
          variant="primary"
          className="flex-1 basis-0 min-w-fit"
          onClick={clear}
          svg={<IconArrowBackUp />}
          disabled={disabled}
        >
          <span className="hidden sm:flex">{t("games.actions.clearBet")}</span>
        </Button>
      </div>

      {children}

      <Button
        variant="secondary"
        className="min-w-fit w-full"
        svg={<IconPlayCard />}
        onClick={start}
        disabled={disabled}
      >
        {t("games.actions.bet")}
      </Button>
    </div>
  )
}

export default BettingBtns
