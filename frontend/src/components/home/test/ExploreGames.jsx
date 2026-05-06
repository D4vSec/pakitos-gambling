const ExploreGames = () => {
  const games = [
    "Cyber Drift",
    "Mystic Quest",
    "Battle Zone",
    "Sky Legends",
    "Arena Clash",
    "Void Runner",
    "Pixel Hero",
    "Dark Forest",
  ]

  return (
    <section className="w-full">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-primary">Explore Games</h3>
        <p className="text-sm md:text-base text-secondary opacity-70 mt-1">
          A curated selection of games for every mood and style
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {games.map((game, i) => (
          <div
            key={i}
            className="aspect-[5/4] rounded-xl relative overflow-hidden bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/10 border border-secondary/20 p-3">
            <div className="absolute top-2 left-2 flex gap-1">
              <span className="text-[10px] bg-accent/30 px-1 rounded">Hot</span>
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
  )
}

export default ExploreGames
