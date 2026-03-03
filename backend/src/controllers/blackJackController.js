//TODO: Implement the game logic
import createBlackJack from "#services/blackJack"
import User from "#models/userModel"

const games = new Map()
//This will definitely not be like that I'm still cooking rn
export const startGame = (req, res) => {
    const id = req.user.id
    const wallet = User.getUserBalance(id)
    const { amount } = req.body
    if (amount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const blackJack = createBlackJack()
    const gameId = crypto.randomUUID()

    try {
        User.updateUserBalance(id, -amount)

        const deck = blackJack.shuffleDeck(blackJack.createDeck())
        const playerHand = blackJack.getInitialHand(deck)
        const dealerHand = blackJack.getInitialHand(deck)

        const game = {
            gameId,
            game: "blackjack",
            status: "ongoing", // ongoing | finished
            createdAt: new Date().toISOString(),
            amount,
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

            const payout = game.winner === "Player" ? amount * 1.5 + amount : 0

            if (game.winner === "Player") User.updateUserBalance(id, payout)
            games.set(gameId, game)
        }

        res.json(game)
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const hit = (req, res) => {
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        const game = games.get(gameId)
        if (game.status === "finished") {
            return res.status(400).json({ code: "GAME_ALREADY_FINISHED" })
        }

        game.player.hand = blackJack.hit(game.deck, game.player.hand)
        game.player.value = blackJack.calculateHandValue(game.player.hand)
        game.player.bust = game.player.value > 21

        if (game.player.bust) {
            game.status = "finished"
            game.winner = "Dealer"
        }

        games.set(gameId, game)
        res.json(game)
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const stand = (req, res) => {
    const id = req.user.id
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        const game = games.get(gameId)
        if (game.status === "finished") {
            return res.status(400).json({ code: "GAME_ALREADY_FINISHED" })
        }

        const dealerFinalHand = blackJack.dealerPlay(
            game.deck,
            game.dealer.hand,
            game.player.hand,
        )
        game.dealer.hand = dealerFinalHand
        game.dealer.value = blackJack.calculateHandValue(dealerFinalHand)

        const winner = blackJack.determinateWinner(
            game.player.value,
            game.dealer.value,
        )
        game.winner = winner
        game.status = "finished"

        const payout = game.winner === "Player" ? game.amount + game.amount : 0

        if (game.winner === "Player") User.updateUserBalance(id, payout)

        games.set(gameId, game)
        res.json(game)
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const double = (req, res) => {
    const id = req.user.id
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        const game = games.get(gameId)
        if (game.status === "finished") {
            return res.status(400).json({ code: "GAME_ALREADY_FINISHED" })
        }

        game.player.hand = blackJack.hit(game.deck, game.player.hand)
        game.player.value = blackJack.calculateHandValue(game.player.hand)
        game.player.bust = game.player.value > 21

        if (game.player.bust) {
            game.status = "finished"
            game.winner = "Dealer"
        } else {
            const dealerFinalHand = blackJack.dealerPlay(
                game.deck,
                game.dealer.hand,
                game.player.hand,
            )
            const winner = blackJack.determinateWinner(
                game.player.value,
                game.dealer.value,
            )
            game.winner = winner
            game.status = "finished"

            if (game.winner === "Player") {
                const payout = game.amount * 2 + game.amount
                User.updateUserBalance(id, payout)
            }
        }
        games.set(gameId, game)
        res.json(game)
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//TODO: Implement split in a future update

export const deleteGame = (req, res) => {
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        games.delete(gameId)
        res.json({ message: "Game deleted successfully" })
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
//This method is just for testing purposes, it will not be here in the final version
export const getGames = (req, res) => {
    try {
        const gamesArray = Array.from(games.values())
        res.json(gamesArray)
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

