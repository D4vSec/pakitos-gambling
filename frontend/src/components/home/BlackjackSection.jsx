import GameCard from "./GameCard"
import GameSection from "./GameSection"
import BlackjackSVG from "../svg/BlackjackSVG"
import Blackjack from "@/assets/blackjack.png"
import { useLocale } from "@/providers/LocaleProvider"

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
        badges={[{ label: "HOT", variant: "primary" }]}
      />
    </GameSection>
  )
}

export default BlackjackSection
