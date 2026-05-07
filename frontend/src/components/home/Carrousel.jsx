import React from "react"

const Carrousel = () => {
  return (
    <section className="w-full">
      <div className="relative h-56 md:h-80 rounded-2xl overflow-hidden bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-accent/10" />

        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 space-y-3 max-w-md">
          <h2 className="text-xl md:text-3xl font-bold text-primary">Featured Game of the Week</h2>

          <p className="text-sm md:text-base text-secondary opacity-80 leading-relaxed">
            Discover the most played and trending game right now. Jump in and start playing
            instantly.
          </p>

          <button className="btn btn-primary btn-md ">Play Now</button>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-20 h-28 rounded-lg bg-secondary/20 border border-secondary/30 flex items-end p-2"
            >
              <span className="text-[10px] text-secondary">Preview</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carrousel
