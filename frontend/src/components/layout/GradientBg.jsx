import React from "react"

const GradientBg = ({ children }) => {
  return (
    <div className="bg-linear-120 from-red-900 via-primary/80 to-red-900  min-h-full h-full w-full min-w-0 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-16 xl:px-24 2xl:px-36 flex flex-col justify-center items-stretch gap-6 *:h-full *:w-full *:min-w-0 *:flex-1">
      {children}
    </div>
  )
}

export default GradientBg
