//TODO: Implement the game logic
import { createBlackJack } from "../services/blackJack.js"

const blackJack = createBlackJack()

let currentGame = null
//This will definitely not be like that I'm still cooking rn
export const startGame = (req, res) => {
    try {
        const { amount } = req.body
        const deck = blackJack.shuffleDeck(blackJack.createDeck())
        const playerHand = blackJack.getInitialHand(deck)
        const dealerHand = blackJack.getInitialHand(deck)

        currentGame = {
            gameId: crypto.randomUUID(),
            game: "blackjack",
            status: "ongoing", // ongoing | finished
            createdAt: new Date().toISOString(),
            player: {
                hand: playerHand,
                value: blackJack.calculateHandValue(playerHand),
                bust: blackJack.calculateHandValue(playerHand) > 21,
                blackjack: false,
            },
            dealer: {
                hand: dealerHand,
                value: blackJack.calculateHandValue(dealerHand),
            },
            deck: deck,
            result: null,
        }
        //If the player hits a blackJack
        if (blackJack.calculateHandValue(playerHand) === 21) {
            currentGame.status = "finished"
            const dealerFinalHand = blackJack.dealerPlay(deck, dealerHand)
            const winner = blackJack.determinateWinner(
                blackJack.calculateHandValue(playerHand),
                blackJack.calculateHandValue(dealerFinalHand),
            )
            return res.json({
                playerHand,
                dealerHand: dealerFinalHand,
                winner,
            })
        }
        res.json({
            playerHand,
            dealerHand: [dealerHand[0], { suit: "hidden", rank: "hidden" }],
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const hit = (req, res) => {
    try {
        const { playerHand, dealerHand } = req.body
        const newHand = blackJack.hit(deck, hand)
        const handValue = blackJack.calculateHandValue(newHand)
        res.json({ newHand, handValue })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
