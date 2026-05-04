import GameCard from "./GameCard"
import GameSection from "./GameSection"
import CoinsSVG from "../svg/CoinsSVG"
import StarWars from "@/assets/starwars.webp"
import StardewValley from "@/assets/stardewvalley.webp"
import BeerMan from "@/assets/beerman.jpeg"
import { useLocale } from "@/providers/LocaleProvider"

const SlotsSection = () => {
  const slotsGames = [
    {
      title: "Star Wars Slot",
      description: "3x3 slot machine",
      image: StarWars,
      route: "/slots",
      badges: [
        { label: "POPULAR", variant: "success" },
        { label: "NEW", variant: "primary" },
      ],
    },
    {
      title: "Stardew Valley Slot",
      description: "3x5 slot machine",
      image: StardewValley,
      route: "/slots3x5",
      badges: [
        { label: "POPULAR", variant: "success" },
        { label: "NEW", variant: "primary" },
      ],
    },
    {
      title: "Beer Slot",
      description: "5x5 slot machine",
      image: BeerMan,
      route: "/slots5x5",
      badges: [
        { label: "POPULAR", variant: "success" },
        { label: "NEW", variant: "primary" },
      ],
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
