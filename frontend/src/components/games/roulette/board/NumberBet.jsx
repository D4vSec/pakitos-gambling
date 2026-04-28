import React from "react"

const NumberBet = React.memo(({ item, children }) => {
  if (!item) return null

  return (
    <button
      className={`${item.classes}  text-white font-bold w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out`}
      data-info={JSON.stringify(item)}>
      {item.text}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </button>
  )
})

export default NumberBet
