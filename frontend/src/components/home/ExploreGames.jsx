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
import { IconDeviceGamepad2 } from "@tabler/icons-react"

const ExploreGames = () => {
  const { t } = useLocale()

  const games = [
    {
      game: "slots.beer",
      img: BeerManImg,
      route: "/slots/beerman",
      badges: [<TeachersColabBadge />, <CreatorsFavBadge />],
    },
    {
      game: "slots.starwars",
      img: StarWarsImg,
      route: "/slots/starwars",
      badges: [<TeachersColabBadge />],
    },
    {
      game: "slots.stardewValley",
      img: StardewValleyImg,
      route: "/slots/stardewvalley",
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
      <div className="mb-5 sm:mb-6">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="rounded-xl bg-primary p-2 sm:p-2.5">
            <IconDeviceGamepad2 />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-secondary sm:text-2xl md:text-3xl">
              {t("pages.home.exploreGames.title")}
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-secondary/70 sm:hidden">
              {t("pages.home.exploreGames.description")}
            </p>
          </div>
        </div>

        <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-secondary/70 sm:block md:text-base">
          {t("pages.home.exploreGames.description")}
        </p>
        <div className="my-4 h-0.5 rounded-lg bg-primary/80 sm:my-5"></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.route} game={game} />
        ))}
      </div>
    </section>
  )
}

export default ExploreGames
