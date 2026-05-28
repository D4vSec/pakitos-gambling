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
      className={`${item.classes} text-white font-bold aspect-square md:aspect-auto w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out`}
      data-info={JSON.stringify(item)}
      onMouseEnter={() => onHover(item.bet)}
      onMouseLeave={() => onHover("")}>
      {["red", "black", "odd", "even", "col 1", "col 2", "col 3"].includes(
        item.text,
      )
        ? t(`games.roulette.board.${item.text}`)
        : item.text}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </Button>
  )
})

export default ExternalBet
