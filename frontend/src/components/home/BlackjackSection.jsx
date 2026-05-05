import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import GameCard from "./GameCard"
import GameSection from "./GameSection"
import BlackjackSVG from "../svg/pictures/BlackjackSVG"
import Blackjack from "@/assets/blackjack.png"
import PopularBadge from "../badges/PopularBadge"

const BlackjackSection = () => {
  const { t } = useLocale()

  return (
    <GameSection
      title={t("pages.home.cards.blackjack.title")}
      icon={<BlackjackSVG />}>
      <GameCard
        title="Blackjack"
        description={t("pages.home.cards.blackjack.description")}
        image={Blackjack}
        route="/blackjack"
        badges={[<PopularBadge />]}
      />
    </GameSection>
  )
}

export default BlackjackSection
