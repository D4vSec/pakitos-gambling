import React from "react"
import BlackjackBoard from "@/components/games/blackjack/board/BlackjackBoard"
import BlackjackControls from "@/components/games/blackjack/controls/BlackjackControls"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"
import BlackjackProvider from "@/providers/BlackjackProvider"
import { useLocale } from "@/providers/LocaleProvider"
import blackjackImage from "@/assets/home/carrousel/blackjackBanner.jpg"

const BlackjackGame = () => {
  const { t } = useLocale()
  return (
    <BlackjackProvider>
      <GameTemplate
        game={<BlackjackBoard />}
        description={
          <GameDescription
            title={t("games.blackjack.title")}
            image={blackjackImage}
            imageAlt={t("games.blackjack.imageAlt")}
            summaryTitle={t("games.description.summaryTitle")}
            summary={t("games.blackjack.summary")}
            howToPlayTitle={t("games.description.howToPlayTitle")}
            howToPlay={t("games.blackjack.howToPlay")}
          />
        }
        controls={<BlackjackControls />}
      />
    </BlackjackProvider>
  )
}

export default BlackjackGame
