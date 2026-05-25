import React, { useState } from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider from "@/providers/SlotsProvider"
import SlotMachine from "@/components/games/slots/SlotMachine"
import SlotControls from "@/components/games/slots/SlotControls"

const SlotsGame = ({ type = "3x3", theme = "starwars" }) => {
  const { t } = useLocale()
  const [selectedType, setSelectedType] = useState(type)

  return (
    <SlotsProvider key={selectedType} type={selectedType}>
      <GameTemplate
        game={<SlotMachine type={selectedType} theme={theme} />}
        controls={<SlotControls type={selectedType} theme={theme} onTypeChange={setSelectedType} />}
        description={
          <GameDescription title={t("games.slots.title")}>
            {t("games.slots.description")}
          </GameDescription>
        }
      />
    </SlotsProvider>
  )
}

export default SlotsGame
