import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider, { useSlots } from "@/providers/SlotsProvider"
import SlotMachine from "@/components/games/slots/SlotMachine"
import SlotControls from "@/components/games/slots/SlotControls"
import slots3x3Image from "@/assets/home/cards/starwars.webp"
import slots3x5Image from "@/assets/home/cards/stardewvalley.webp"
import slots5x5Image from "@/assets/home/cards/beerman.jpeg"

const slotImages = {
  "3x3": slots3x3Image,
  "3x5": slots3x5Image,
  "5x5": slots5x5Image,
}

const SlotsGameContent = ({ theme = "starwars" }) => {
  const { t } = useLocale()
  const { type } = useSlots()

  return (
    <GameTemplate
      game={<SlotMachine theme={theme} />}
      controls={<SlotControls theme={theme} />}
      description={
        <GameDescription
          title={t("games.slots.title")}
          image={slotImages[type]}
          imageAlt={t(`games.slots.imageAlt.${type}`)}
          summaryTitle={t("games.description.summaryTitle")}
          summary={t(`games.slots.summary.${type}`)}
          howToPlayTitle={t("games.description.howToPlayTitle")}
          howToPlay={t("games.slots.howToPlay")}
        />
      }
    />
  )
}

const SlotsGame = ({ type = "3x3", theme = "starwars" }) => (
  <SlotsProvider type={type} slotKey={theme}>
    <SlotsGameContent theme={theme} />
  </SlotsProvider>
)

export default SlotsGame
