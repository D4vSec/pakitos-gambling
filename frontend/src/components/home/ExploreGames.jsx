import { useLocale } from "@/providers/LocaleProvider"
import React from "react"
import PopularBadge from "@/components/badges/PopularBadge"
import PayoutBadge from "@/components/badges/PayoutBadge"
import HotBadge from "@/components/badges/HotBadge"
import NewBadge from "@/components/badges/NewBadge"
import TeachersColabBadge from "@/components/badges/TeacharsColabBadge"
import CreatorsFavBadge from "@/components/badges/CreatorsFavBadge"

import BlackjackImg from "@/assets/home/blackjack.png"
import Roulette00Img from "@/assets/home/roulette00banner.jpg"
import Roulette0Img from "@/assets/home/roulette0banner.webp"
import CapybaraImg from "@/assets/home/capybara_packet_tracer.jpeg"
import StarWarsImg from "@/assets/home/starwars.webp"
import StardewValleyImg from "@/assets/home/stardewvalley.webp"
import BeerManImg from "@/assets/home/beerman.jpeg"
import GameCard from "./GameCard"

const ExploreGames = () => {
  const { t } = useLocale()

  const games = [
    {
      game: "blackjack",
      img: BlackjackImg,
      route: "/blackjack",
      badges: [<PopularBadge />],
    },
    {
      game: "capyroad",
      img: CapybaraImg,
      route: "/capyroad",
      badges: [<NewBadge />],
    },
    {
      game: "roulette.classic",
      img: Roulette0Img,
      route: "/roulette0",
      badges: [<PayoutBadge text={50000} />],
    },
    {
      game: "roulette.american",
      img: Roulette00Img,
      route: "/roulette00",
      badges: [<HotBadge />],
    },
    {
      game: "slots.beer",
      img: BeerManImg,
      route: "/slots5x5",
      badges: [<TeachersColabBadge />, <CreatorsFavBadge />],
    },
    {
      game: "slots.starwars",
      img: StarWarsImg,
      route: "/slots",
      badges: [<TeachersColabBadge />],
    },
    {
      game: "slots.stardewValley",
      img: StardewValleyImg,
      route: "/slots3x5",
      badges: [<TeachersColabBadge />],
    },
  ]

  return (
    <section className="w-full">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-primary">
          {t("pages.home.exploreGames.title")}
        </h3>
        <p className="text-sm md:text-base text-secondary opacity-70 mt-1">
          {t("pages.home.exploreGames.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {games.map((game, i) => (
          <GameCard key={i} game={game} />
        ))}
      </div>
    </section>
  )
}

export default ExploreGames
