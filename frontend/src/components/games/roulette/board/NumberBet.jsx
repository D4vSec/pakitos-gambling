import React from "react"
import Button from "@/components/buttons/Button"

const NumberBet = React.memo(({ item, cellId, children }) => {
  if (!item) return null

  return (
    <Button
      type="button"
      unstyled
      className={`${item.classes} min-w-0 overflow-hidden text-[clamp(0.55rem,2.2vw,0.8rem)] leading-none text-white font-bold w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out md:text-sm lg:text-base`}
      data-cell-id={cellId}>
      {item.text}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </Button>
  )
})

export default NumberBet
