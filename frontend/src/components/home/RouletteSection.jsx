import React from "react"
import GameSection from "./GameSection"
import GameCard from "./GameCard"
import LemonSVG from "../svg/pictures/LemonSVG"
import roulette00 from "@/assets/home/roulette00banner.jpg"
import roulette0 from "@/assets/home/roulette0banner.webp"
import { useLocale } from "@/providers/LocaleProvider"
import HotBadge from "../badges/HotBadge"
import PayoutBadge from "../badges/PayoutBadge"

const RouletteSection = () => {
  const { t } = useLocale()
  const rouletteGames = [
    {
      title: "pages.home.cards.roulette.classic.title",
      description: "pages.home.cards.roulette.classic.description",
      image: roulette0,
      route: "/roulette0",
      badges: [<PayoutBadge text={50000} />],
    },

    {
      title: "pages.home.cards.roulette.american.title",
      description: "pages.home.cards.roulette.american.description",
      image: roulette00,
      route: "/roulette00",
      badges: [<HotBadge />],
    },
  ]

  return (
    <GameSection
      title={t("pages.home.cards.roulette.title")}
      icon={<LemonSVG className="w-6 h-6" />}>
      {rouletteGames.map((game, index) => (
        <GameCard
          key={index}
          title={game.title}
          description={game.description}
          image={game.image}
          route={game.route}
          badges={game.badges}
        />
      ))}
    </GameSection>
  )
}

export default RouletteSection
