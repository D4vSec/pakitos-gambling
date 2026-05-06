import React from "react"

const GameSection = ({ title, icon, children }) => {
  return (
    <section className="w-full">
      <div className="mb-4 md:mb-6 border-b pb-2 md:pb-3 text-primary">
        <h2 className="flex items-center gap-2 md:gap-3 text-lg sm:text-xl md:text-2xl font-bold text-secondary">
          <div className="bg-primary rounded-lg p-1 md:p-1.5 scale-90 md:scale-100">
            {icon}
          </div>
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {children}
      </div>
    </section>
  )
}

export default GameSection
