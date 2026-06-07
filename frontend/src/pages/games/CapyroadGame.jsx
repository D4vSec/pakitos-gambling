import React from "react"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"
import CapyroadProvider from "@/providers/CapyroadProvider"
import Capyroad from "@/components/games/capyroad/Capyroad"
import { useLocale } from "@/providers/LocaleProvider"
import CapyroadControls from "@/components/games/capyroad/controls/CapyroadControls"
import capyroadImage from "@/assets/home/carrousel/capybaraBanner.webp"

const CapyroadGame = () => {
  const { t } = useLocale()
  return (
    <CapyroadProvider>
      <GameTemplate
        game={<Capyroad />}
        description={
          <GameDescription
            title={t("games.capyroad.title")}
            image={capyroadImage}
            imageAlt={t("games.capyroad.imageAlt")}
            summaryTitle={t("games.description.summaryTitle")}
            summary={t("games.capyroad.summary")}
            howToPlayTitle={t("games.description.howToPlayTitle")}
            howToPlay={t("games.capyroad.howToPlay")}
          />
        }
        controls={<CapyroadControls />}
      />
    </CapyroadProvider>
  )
}

export default CapyroadGame
