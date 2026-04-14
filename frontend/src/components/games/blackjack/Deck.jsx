import Card from "./Card"

const Deck = () => {
  const deck = Array.from({ length: 10 }, () => ({
    rank: "hidden",
    suit: "hidden",
  }))

  return (
    <div className="relative w-20 h-28 mt-4">
      {deck.map((card, i) => (
        <div key={i} className="absolute" style={{ bottom: i * 1 }}>
          <Card card={card} forceHidden />
        </div>
      ))}
    </div>
  )
}

export default Deck
