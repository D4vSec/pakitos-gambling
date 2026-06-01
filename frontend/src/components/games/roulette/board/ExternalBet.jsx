import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"

const ExternalBet = React.memo(({ item, children, onHover }) => {
  const { t } = useLocale()

  if (!item) return null

  return (
    <Button
      type="button"
      unstyled
      className={`${item.classes} min-w-0 overflow-hidden px-0.5 text-center text-[clamp(0.48rem,2vw,0.7rem)] leading-none text-white font-bold w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out md:px-1 md:text-sm lg:text-base`}
      data-info={JSON.stringify(item)}
      onMouseEnter={() => onHover(item.bet)}
      onMouseLeave={() => onHover("")}>
      {["red", "black", "odd", "even", "col 1", "col 2", "col 3"].includes(
        item.text,
      )
        ? t(`games.roulette.board.${item.text}`)
        : item.text}

      <div className="roulette-chip-layer roulette-chip-layer-external absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </Button>
  )
})

export default ExternalBet
