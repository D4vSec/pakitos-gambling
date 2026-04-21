import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import { useLocale } from "@/providers/LocaleProvider"
import SlotsProvider from "@/providers/SlotsProvider"
import SlotMachine from "@/components/games/slots/SlotMachine"
import SlotControls from "@/components/games/slots/SlotControls"

const MACHINE_TYPE = "3x3"

const SlotsGame = () => {
  const { t } = useLocale()
  return (
    <SlotsProvider>
      <GameTemplate
        game={<SlotMachine type={MACHINE_TYPE} />}
        controls={<SlotControls type={MACHINE_TYPE} />}
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
