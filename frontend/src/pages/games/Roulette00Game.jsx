import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import Roulette from "@/components/games/roulette/Roulette"
import React from "react"
import RouletteControls from "@/components/games/roulette/controls/RouletteControls"
import RouletteProvider from "@/providers/RouletteProvider"
import { useLocale } from "@/providers/LocaleProvider"
import roulette00Image from "@/assets/home/cards/roulette00banner.jpg"

const Roulette00Game = () => {
  const { t } = useLocale()
  return (
    <RouletteProvider>
      <GameTemplate
        game={<Roulette />}
        description={
          <GameDescription
            title={t("games.roulette.types.ZeroZero")}
            image={roulette00Image}
            imageAlt={t("games.roulette.imageAltZeroZero")}
            summaryTitle={t("games.description.summaryTitle")}
            summary={t("games.roulette.summaryZeroZero")}
            howToPlayTitle={t("games.description.howToPlayTitle")}
            howToPlay={t("games.roulette.howToPlay")}
          />
        }
        controls={<RouletteControls />}
      />
    </RouletteProvider>
  )
}

export default Roulette00Game
