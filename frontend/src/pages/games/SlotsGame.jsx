import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider from "@/providers/SlotsProvider"
import SlotMachine from "@/components/games/slots/SlotMachine"
import SlotControls from "@/components/games/slots/SlotControls"

const SlotsGame = ({ type = "3x3" }) => {
  const { t } = useLocale()
  return (
    <SlotsProvider type={type}>
      <GameTemplate
        game={<SlotMachine type={type} />}
        controls={<SlotControls type={type} />}
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
