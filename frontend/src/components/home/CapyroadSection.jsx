import GameCard from "./GameCard"
import GameSection from "./GameSection"
import capybaraImg from "@/assets/capybara_packet_tracer.jpeg"
import CrownSVG from "../svg/CrownSVG"
import { useLocale } from "@/providers/LocaleProvider"

const CapyroadSection = () => {
  const { t } = useLocale()

  return (
    <GameSection
      title={t("pages.home.cards.capyroad.title")}
      icon={<CrownSVG className="w-6 h-6" />}>
      <GameCard
        title="Capyroad"
        description={t("pages.home.cards.capyroad.description")}
        image={capybaraImg}
        route="/capyroad"
        badges={[{ label: "NEW", variant: "primary" }]}
      />
    </GameSection>
  )
}

export default CapyroadSection
