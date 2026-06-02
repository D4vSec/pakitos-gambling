import { createContext, useContext } from "react"

export const RouletteContext = createContext()
export const RouletteAnimationContext = createContext()

export const useRoulette = () => {
  const context = useContext(RouletteContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}

export const useRouletteAnimation = () => {
  const context = useContext(RouletteAnimationContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}
