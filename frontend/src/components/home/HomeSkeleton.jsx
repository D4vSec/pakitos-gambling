import React from "react"

const HomeSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-10 md:gap-14">
      {/* 🔥 HERO FEATURED */}
      <section className="w-full">
        <div className="relative h-56 md:h-80 rounded-2xl overflow-hidden bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20">
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-accent/10" />

          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 space-y-3 max-w-md">
            <h2 className="text-xl md:text-3xl font-bold text-primary">
              Featured Game of the Week
            </h2>

            <p className="text-sm md:text-base text-secondary opacity-80 leading-relaxed">
              Discover the most played and trending game right now. Jump in and
              start playing instantly.
            </p>

            <button className="btn btn-primary btn-md ">Play Now</button>
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-20 h-28 rounded-lg bg-secondary/20 border border-secondary/30 flex items-end p-2">
                <span className="text-[10px] text-secondary">Preview</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💰 RECENT EARNINGS */}
      <section className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-base-content">
            Recent Earnings
          </h3>
          <span className="text-sm opacity-60">Live activity</span>
        </div>

        <div className="flex gap-3 overflow-hidden">
          {[
            { user: "Alex", game: "Cyber Drift", amount: "+$120" },
            { user: "Marta", game: "Arena Clash", amount: "+$85" },
            { user: "John", game: "Space Ops", amount: "+$210" },
            { user: "Sara", game: "Neon Rush", amount: "+$64" },
            { user: "Leo", game: "Dark Forest", amount: "+$98" },
          ].map((item, i) => (
            <div
              key={i}
              className="min-w-[180px] h-28 rounded-xl bg-base-200 border border-base-300 p-3 flex flex-col justify-between">
              <div>
                <p className="text-base font-semibold text-base-content">
                  {item.user}
                </p>
                <p className="text-sm opacity-70">{item.game}</p>
              </div>

              <p className="text-base font-bold text-emerald-500">
                {item.amount}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎮 MAIN GRID */}
      <section className="w-full">
        <div className="mb-5">
          <h3 className="text-2xl font-semibold text-primary">Explore Games</h3>
          <p className="text-sm md:text-base text-secondary opacity-70 mt-1">
            A curated selection of games for every mood and style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            "Cyber Drift",
            "Mystic Quest",
            "Battle Zone",
            "Sky Legends",
            "Arena Clash",
            "Void Runner",
            "Pixel Hero",
            "Dark Forest",
          ].map((game, i) => (
            <div
              key={i}
              className="aspect-[5/4] rounded-xl relative overflow-hidden bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/10 border border-secondary/20 p-3">
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="text-[10px] bg-accent/30 px-1 rounded">
                  Hot
                </span>
                <span className="text-[10px] bg-primary/20 px-1 rounded">
                  New
                </span>
              </div>

              <div className="absolute bottom-2 left-2">
                <p className="text-sm md:text-base font-semibold text-base-content">
                  {game}
                </p>
                <p className="text-xs md:text-sm text-base-content opacity-70">
                  Click to play and compete
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧩 CATEGORIES */}
      <section className="w-full">
        <h3 className="text-2xl font-semibold text-primary mb-4">
          Browse by Category
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Action", "Puzzle", "Multiplayer", "Casual"].map((cat, i) => (
            <div
              key={i}
              className="h-16 rounded-xl flex flex-col items-center justify-center 
        bg-base-200 border border-base-300 hover:bg-base-300 transition">
              <p className="text-base font-semibold text-base-content">{cat}</p>
              <p className="text-xs text-base-content/70">Explore</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎲 CTA */}
      <section className="w-full">
        <div className="relative h-28 md:h-32 rounded-2xl flex items-center justify-between px-5 overflow-hidden">
          {/* overlay para contraste */}
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/80 via-base-200/60 to-base-100/80" />

          <div className="relative z-10">
            <h4 className="text-lg font-semibold text-base-content">
              Not sure what to play?
            </h4>
            <p className="text-sm md:text-base text-base-content/70">
              Let us pick a random game for you
            </p>
          </div>

          <button className="relative z-10 btn btn-secondary btn-sm md:btn-md">
            Surprise me
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomeSkeleton
