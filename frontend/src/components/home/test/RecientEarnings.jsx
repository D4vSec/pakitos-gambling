const RecentEarnings = () => {
  const data = [
    { user: "Alex", game: "Cyber Drift", amount: "+$120" },
    { user: "Marta", game: "Arena Clash", amount: "+$85" },
    { user: "John", game: "Space Ops", amount: "+$210" },
    { user: "Sara", game: "Neon Rush", amount: "+$64" },
    { user: "Leo", game: "Dark Forest", amount: "+$98" },
  ]

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-base-content">
          Recent Earnings
        </h3>
        <span className="text-sm opacity-60">Live activity</span>
      </div>

      <div className="flex gap-3 overflow-hidden">
        {data.map((item, i) => (
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
  )
}

export default RecentEarnings
