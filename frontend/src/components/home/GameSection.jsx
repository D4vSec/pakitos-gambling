import React from "react"

const GameSection = ({ title, icon, children }) => {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
      <div className="mb-6 border-b-2 pb-3 text-primary">
        <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-secondary">
          <div className="bg-primary rounded-xl p-1.5">{icon}</div>
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  )
}

export default GameSection
