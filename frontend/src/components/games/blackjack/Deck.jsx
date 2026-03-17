import Card from "./Card"

const Deck = () => {
    const suits = ["hidden"]
    const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let deck = []

    const createDeck = () => {
        for (let suit of suits) {
            for (let card of cards) {
                deck.push({ rank: card, suit: suit })
            }
        }
        return deck
    }

    createDeck()

    return (
        <div className="relative w-20 h-28 mt-4">
            {deck.map((card, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        bottom: i * 1,
                    }}
                >
                    <Card card={card} />
                </div>
            ))}
        </div>
    )
}

export default Deck
