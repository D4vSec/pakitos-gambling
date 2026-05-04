import React from "react"
import GameSection from "./GameSection"
import GameCard from "./GameCard"
import LemonSVG from "../svg/LemonSVG"
import roulette00 from "@/assets/roulette00banner.jpg"
import roulette0 from "@/assets/roulette0banner.webp"
import { useLocale } from "@/providers/LocaleProvider"

const RouletteSection = () => {
  const { t } = useLocale()
  const rouletteGames = [
    {
      title: "American Roulette",
      description: "Classic american roulette experience",
      image: roulette00,
      route: "/roulette00",
      badges: [
        { label: "POPULAR", variant: "success" },
        { label: "NEW", variant: "primary" },
      ],
    },
    {
      title: "Classic Roulette",
      description: "Traditional european style roulette",
      image: roulette0,
      route: "/roulette0",
      badges: [{ label: "1.1M", variant: "warning" }],
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
