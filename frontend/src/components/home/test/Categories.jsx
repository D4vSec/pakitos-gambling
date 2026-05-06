const Categories = () => {
  const cats = ["Action", "Puzzle", "Multiplayer", "Casual"]

  return (
    <section className="w-full">
      <h3 className="text-2xl font-semibold text-primary mb-4">
        Browse by Category
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cats.map((cat, i) => (
          <div
            key={i}
            className="h-16 rounded-xl flex flex-col items-center justify-center bg-base-200 border border-base-300 hover:bg-base-300 transition">
            <p className="text-base font-semibold text-base-content">{cat}</p>
            <p className="text-xs text-base-content/70">Explore</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
