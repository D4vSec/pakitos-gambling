import React from "react"
import GameNotifications from "../notification/GameNotifications"

const GameScreen = ({ game, controls }) => {
  return (
    <div className="grid h-[calc(100dvh-4rem-0.75rem)] w-full min-w-0 grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden [@media(orientation:landscape)_and_(max-width:1023px)]:h-auto [@media(orientation:landscape)_and_(max-width:1023px)]:min-h-[calc(100vw-4rem-0.75rem)] [@media(orientation:landscape)_and_(max-width:1023px)]:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] [@media(orientation:landscape)_and_(max-width:1023px)]:overflow-visible md:h-[calc(100dvh-4rem-1rem)] md:gap-4 lg:h-[calc(100dvh-12.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)] lg:grid-rows-1 lg:gap-6">
      <div className="relative bg-base-100 rounded-md border-8 md:border-12 lg:border-16 border-base-100 flex items-center justify-center overflow-hidden min-h-0">
        <GameNotifications />
        {game}
      </div>
      <div className="bg-base-100 rounded-md min-h-0 overflow-y-auto">
        {controls}
      </div>
    </div>
  )
}

export default GameScreen
