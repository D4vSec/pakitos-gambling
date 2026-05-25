import { useLocale } from "@/providers/LocaleProvider"
import React from "react"
import PopularBadge from "@/components/badges/PopularBadge"
import PayoutBadge from "@/components/badges/PayoutBadge"
import HotBadge from "@/components/badges/HotBadge"
import NewBadge from "@/components/badges/NewBadge"
import TeachersColabBadge from "@/components/badges/TeacharsColabBadge"
import CreatorsFavBadge from "@/components/badges/CreatorsFavBadge"

import BlackjackImg from "@/assets/home/cards/blackjack.png"
import Roulette00Img from "@/assets/home/cards/roulette00banner.jpg"
import Roulette0Img from "@/assets/home/cards/roulette0banner.webp"
import CapybaraImg from "@/assets/home/cards/capybara_packet_tracer.jpeg"
import StarWarsImg from "@/assets/home/cards/starwars.webp"
import StardewValleyImg from "@/assets/home/cards/stardewvalley.webp"
import BeerManImg from "@/assets/home/cards/beerman.jpeg"
import GameCard from "./GameCard"
import ControllerSVG from "../svg/pictures/ControllerSVG"

const ExploreGames = () => {
  const { t } = useLocale()

  const games = [
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
    {
      game: "roulette.american",
      img: Roulette00Img,
      route: "/roulette00",
      badges: [<HotBadge />],
    },
    {
      game: "roulette.classic",
      img: Roulette0Img,
      route: "/roulette0",
      badges: [<PayoutBadge text={50000} />],
    },
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
  ]

  return (
    <section className="w-full">
      <div className="mb-5">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary">
            <ControllerSVG />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-secondary">
            {t("pages.home.exploreGames.title")}
          </h3>
        </div>
        <p className="mt-2 text-sm md:text-base text-secondary opacity-70 ">
          {t("pages.home.exploreGames.description")}
        </p>
        <div className="bg-primary rounded-lg h-0.5 my-4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.route} game={game} />
        ))}
      </div>
    </section>
  )
}

export default ExploreGames
