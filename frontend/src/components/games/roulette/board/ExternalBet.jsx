import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"

const ExternalBet = React.memo(({ item, cellId, children, onHover }) => {
  const { t } = useLocale()

  if (!item) return null

  return (
    <Button
      type="button"
      unstyled
      className={`${item.classes} min-w-0 overflow-hidden text-center text-[clamp(0.48rem,2vw,0.7rem)] leading-none text-white font-bold w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out md:text-sm lg:text-base`}
      data-cell-id={cellId}
      onMouseEnter={() => onHover(item.bet)}
      onMouseLeave={() => onHover("")}>
      <span className="px-0.5 md:px-1">
        {["red", "black", "odd", "even", "col 1", "col 2", "col 3"].includes(
          item.text,
        )
          ? t(`games.roulette.board.${item.text}`)
          : item.text}
      </span>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </Button>
  )
})

export default ExternalBet
