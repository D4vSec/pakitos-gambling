import GameCard from "./GameCard"
import GameSection from "./GameSection"
import CoinsSVG from "../svg/pictures/CoinsSVG"
import StarWars from "@/assets/starwars.webp"
import StardewValley from "@/assets/stardewvalley.webp"
import BeerMan from "@/assets/beerman.jpeg"
import { useLocale } from "@/providers/LocaleProvider"
import CreatorsFavBadge from "../badges/CreatorsFavBadge"
import TeachersColabBadge from "../badges/TeacharsColabBadge"

const SlotsSection = () => {
  const slotsGames = [
    {
      title: "pages.home.cards.slots.starwars.title",
      description: "pages.home.cards.slots.starwars.description",
      image: StarWars,
      route: "/slots",
      badges: [<TeachersColabBadge />],
    },
    {
      title: "pages.home.cards.slots.stardewValley.title",
      description: "pages.home.cards.slots.stardewValley.description",
      image: StardewValley,
      route: "/slots3x5",
      badges: [<TeachersColabBadge />],
    },
    {
      title: "pages.home.cards.slots.beer.title",
      description: "pages.home.cards.slots.beer.description",
      image: BeerMan,
      route: "/slots5x5",
      badges: [<TeachersColabBadge />, <CreatorsFavBadge />],
    },
  ]
  const { t } = useLocale()

  return (
    <GameSection
      title={t("pages.home.cards.slots.title")}
      icon={<CoinsSVG className="w-6 h-6" />}>
      {slotsGames.map((game, index) => (
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

export default SlotsSection
