//TODO: Implement the game logic
import { createBlackJack } from "../services/blackJack.js"

const blackJack = createBlackJack()

const games = new Map()
//This will definitely not be like that I'm still cooking rn
export const startGame = (req, res) => {
    const gameId = crypto.randomUUID()

    try {
        const { amount } = req.body
        const deck = blackJack.shuffleDeck(blackJack.createDeck())
        const playerHand = blackJack.getInitialHand(deck)
        const dealerHand = blackJack.getInitialHand(deck)

        const game = {
            gameId,
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
            winner: null,
        }

        games.set(gameId, game)

        //If the player hits a blackJack
        if (blackJack.calculateHandValue(playerHand) === 21) {
            game.status = "finished"
            const dealerFinalHand = blackJack.dealerPlay(deck, dealerHand)
            const winner = blackJack.determinateWinner(
                blackJack.calculateHandValue(playerHand),
                blackJack.calculateHandValue(dealerFinalHand),
            )
            game.winner = winner
            games.set(gameId, game)
        }
        
        res.json(game)
        
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
           
export const hit = (req, res) => {
    try {
        const { playerHand, dealerHand } = req.body
        const newHand = blackJack.hit(deck, hand)
        const handValue = blackJack.calculateHandValue(newHand)
        res.json({ newHand, handValue })
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
