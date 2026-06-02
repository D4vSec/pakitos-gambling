import React, { useState } from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider from "@/providers/SlotsProvider"
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

const SlotsGame = ({ type = "3x3", theme = "starwars" }) => {
  const { t } = useLocale()
  const [selectedType, setSelectedType] = useState(type)

  return (
    <SlotsProvider key={selectedType} type={selectedType}>
      <GameTemplate
        game={<SlotMachine type={selectedType} theme={theme} />}
        controls={<SlotControls type={selectedType} theme={theme} onTypeChange={setSelectedType} />}
        description={
          <GameDescription
            title={t("games.slots.title")}
            image={slotImages[selectedType]}
            imageAlt={t(`games.slots.imageAlt.${selectedType}`)}
            summaryTitle={t("games.description.summaryTitle")}
            summary={t(`games.slots.summary.${selectedType}`)}
            howToPlayTitle={t("games.description.howToPlayTitle")}
            howToPlay={t("games.slots.howToPlay")}
          />
        }
      />
    </SlotsProvider>
  )
}

export default SlotsGame
