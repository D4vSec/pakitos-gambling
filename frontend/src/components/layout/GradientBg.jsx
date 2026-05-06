import React from "react"

const GradientBg = ({ children }) => {
  return (
    <div className="bg-linear-to-b from-primary to-base-conten min-h-full px-4 py-4 md:px-8 md:py-8 lg:px-16 flex flex-col justify-center items-center gap-6">
      {children}
    </div>
  )
}

export default GradientBg
