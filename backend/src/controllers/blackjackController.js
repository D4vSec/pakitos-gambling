import createBlackJack from "#services/blackjack"
import User from "#models/userModel"

const games = new Map()

const isGameValid = (gameId, game) => {
    if (!games.has(gameId)) {
        return false
    }
    if (game.status === "finished") {
        return false
    }

    return true
}
// GAME_NOT_VALID

export const startGame = async (req, res) => {
    const id = req.user.id
    const wallet = await User.getUserBalance(id)
    const { amount } = req.body
    if (amount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const blackJack = createBlackJack()
    const gameId = crypto.randomUUID()

    try {
        await User.updateUserBalance(id, -amount)

        const deck = blackJack.shuffleDeck(blackJack.createDeck())
        const playerHand = blackJack.getInitialHand(deck)
        const dealerHand = blackJack.getInitialHand(deck)

        const game = {
            gameId,
            game: "blackjack",
            status: "ongoing", // ongoing | finished
            split: false,
            createdAt: new Date().toISOString(),
            amount,
            player: [
                {
                    hand: playerHand,
                    value: blackJack.calculateHandValue(playerHand),
                    bust: blackJack.calculateHandValue(playerHand) > 21,
                    blackjack: false,
                },
            ],
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

            if (game.winner === "Player")
                await User.updateUserBalance(id, payout)
            games.set(gameId, game)
        }

        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const hit = (req, res) => {
    const blackJack = createBlackJack()
    try {
        const { gameId, hand } = req.params
        const playingHand2 = req.body.playingHand2
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }
        if (playingHand2) {
            game.player[1].hand = blackJack.hit(game.deck, game.player[1].hand)
            game.player[1].value = blackJack.calculateHandValue(game.player[1].hand)
            game.player[1].bust = game.player[1].value > 21

            if (game.player[1].bust) {
                game.status = "finished"
                game.winner2 = "Dealer"
            }

            games.set(gameId, game)
            res.json(game.filter((key) => key !== "deck"))
        } else {
            game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
            game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
            game.player[0].bust = game.player[0].value > 21

            if (game.player[0].bust) {
                game.winner = "Dealer"
            }

            games.set(gameId, game)
            res.json(game.filter((key) => key !== "deck"))
        }
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const stand = async (req, res) => {
    const blackJack = createBlackJack()
    try {
        const id = req.user.id
        const playingHand2 = req.body.playingHand2
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (playingHand2) {
            const dealerFinalHand = blackJack.dealerPlay(
                game.deck,
                game.dealer.hand,
                game.player.hand,
            )
            game.dealer.hand = dealerFinalHand
            game.dealer.value = blackJack.calculateHandValue(dealerFinalHand)
        }
        const winner = blackJack.determinateWinner(
            game.player.value,
            game.dealer.value,
        )

        const winner2 = blackJack.determinateWinner(
            game.player.value2,
            game.dealer.value,
        )

        game.winner = winner
        game.status = "finished"
        game

        const payout = game.winner === "Player" ? game.amount + game.amount : 0

        if (game.winner === "Player") await User.updateUserBalance(id, payout)

        games.set(gameId, game)
        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const double = async (req, res) => {
    const id = req.user.id
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
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
                await User.updateUserBalance(id, payout)
            }
        }
        games.set(gameId, game)
        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//TODO: Implement split in a future update
export const split = (req, res) => {
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }
        //TODO: Implement split logic here
        if (
            game.player.hand.length === 2 &&
            game.player.hand[0].value === game.player.hand[1].value
        ) {
            game.split = true
            const [splitHand1, splitHand2] = blackJack.split(game.player.hand)
            game.player[0].hand = splitHand1
            game.player[0].value = blackJack.calculateHandValue(splitHand1)
            game.player[0].bust = game.player[0].value > 21

            game.player[1].hand = splitHand2
            game.player[1].value = blackJack.calculateHandValue(splitHand2)
            game.player[1].bust = game.player[1].value > 21

            games.set(gameId, game)
            res.json(game.filter((key) => key !== "deck"))
        } else {
            return res.status(400).json({ code: "CANNOT_SPLIT" })
        }
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

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
