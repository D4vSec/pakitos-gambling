import React from "react"
import Button from "../buttons/Button"
import ReloadSVG from "../svg/ReloadSVG"
import { useLocale } from "@/providers/LocaleProvider"

const BettingBtns = ({ children, actions }) => {
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
                >
                    {t("games.actions.repeatBet")}
                </Button>

                <Button variant="primary" className="flex-1 basis-0 min-w-fit" onClick={double}>
                    {t("games.actions.doubleBet")}
                </Button>

                <Button variant="primary" className="w-full" onClick={clear}>
                    {t("games.actions.clearBet")}
                </Button>
            </div>
            {children}
            <Button variant="secondary" className="min-w-fit w-full" onClick={start}>
                {t("games.actions.bet")}
            </Button>
        </div>
    )
}

export default BettingBtns
