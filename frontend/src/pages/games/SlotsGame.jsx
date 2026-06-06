import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider, { useSlots } from "@/providers/SlotsProvider"
import SlotMachine from "@/components/games/slots/SlotMachine"
import SlotControls from "@/components/games/slots/SlotControls"
import starwarsImage from "@/assets/home/cards/starwars.webp"
import stardewValleyImage from "@/assets/home/cards/stardewvalley.webp"
import beermanImage from "@/assets/home/cards/beerman.jpeg"

const slotImagesByTheme = {
  starwars: starwarsImage,
  stardewvalley: stardewValleyImage,
  beerman: beermanImage,
}

const SlotsGameContent = ({ theme = "starwars" }) => {
  const { t } = useLocale()
  const { type } = useSlots()
  const slotImage = slotImagesByTheme[theme] ?? slotImagesByTheme.starwars

  return (
    <GameTemplate
      game={<SlotMachine theme={theme} />}
      controls={<SlotControls theme={theme} />}
      description={
        <GameDescription
          title={t("games.slots.title")}
          image={slotImage}
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
