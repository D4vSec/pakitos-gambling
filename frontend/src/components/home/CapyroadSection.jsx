import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import GameCard from "./GameCard"
import GameSection from "./GameSection"
import capybaraImg from "@/assets/capybara_packet_tracer.jpeg"
import CrownSVG from "../svg/CrownSVG"
import NewBadge from "../badges/NewBadge"
import CreatorsFavBadge from "../badges/CreatorsFavBadge"

const CapyroadSection = () => {
  const { t } = useLocale()

  return (
    <GameSection
      title={t("pages.home.cards.capyroad.title")}
      icon={<CrownSVG />}>
      <GameCard
        title="Capyroad"
        description={t("pages.home.cards.capyroad.description")}
        image={capybaraImg}
        route="/capyroad"
        badges={[<CreatorsFavBadge />, <NewBadge />]}
      />
    </GameSection>
  )
}

export default CapyroadSection
