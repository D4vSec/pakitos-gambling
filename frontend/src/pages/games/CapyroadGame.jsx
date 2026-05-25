import React from "react"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"
import CapyroadProvider from "@/providers/CapyroadProvider"
import Capyroad from "@/components/games/capyroad/Capyroad"
import { useLocale } from "@/providers/LocaleProvider"
import CapyroadControls from "@/components/games/capyroad/controls/CapyroadControls"

const CapyroadGame = () => {
  const { t } = useLocale()
  return (
    <CapyroadProvider>
      <GameTemplate
        game={<Capyroad />}
        description={
          <GameDescription title={t("games.capyroad.title")}>
            {t("games.capyroad.description")}
          </GameDescription>
        }
        controls={<CapyroadControls />}
      />
    </CapyroadProvider>
  )
}

export default CapyroadGame
