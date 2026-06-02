import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import Roulette from "@/components/games/roulette/Roulette"
import RouletteControls from "@/components/games/roulette/controls/RouletteControls"
import RouletteProvider from "@/providers/RouletteProvider"
import { useLocale } from "@/providers/LocaleProvider"
import roulette0Image from "@/assets/home/cards/roulette0banner.webp"

const Roulette0Game = () => {
  const { t } = useLocale()
  return (
    <RouletteProvider>
      <GameTemplate
        game={<Roulette />}
        description={
          <GameDescription
            title={t("games.roulette.types.Zero")}
            image={roulette0Image}
            imageAlt={t("games.roulette.imageAltZero")}
            summaryTitle={t("games.description.summaryTitle")}
            summary={t("games.roulette.summaryZero")}
            howToPlayTitle={t("games.description.howToPlayTitle")}
            howToPlay={t("games.roulette.howToPlay")}
          />
        }
        controls={<RouletteControls />}
      />
    </RouletteProvider>
  )
}

export default Roulette0Game
