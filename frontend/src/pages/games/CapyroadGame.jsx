import React from "react"
import BlackjackControls from "@/components/games/blackjack/controls/BlackjackControls"
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            quaerat libero, labore quo eaque odio accusantium doloribus, culpa
            fugiat impedit qui consequuntur animi facilis harum quasi commodi
            explicabo dolorum in?
          </GameDescription>
        }
        controls={<CapyroadControls />}
      />
    </CapyroadProvider>
  )
}

export default CapyroadGame
