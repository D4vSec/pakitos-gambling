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
            player: [
                {
                    hand: playerHand,
                    value: blackJack.calculateHandValue(playerHand),
                    bust: blackJack.calculateHandValue(playerHand) > 21,
                    blackjack: false,
                    doubled: false,
                    resolved: false,
                    bet: amount, //TODO: Change the amount to the player hands (it will be easier trust)
                },
            ],
            dealer: {
                hand: dealerHand,
                value: blackJack.calculateHandValue(dealerHand),
                bust: blackJack.calculateHandValue(dealerHand) > 21,
                blackJack: false,
            },
            deck: deck,
            winners: [],
            payout: 0,
        }

        games.set(gameId, game)

        //If the player hits a blackJack
        if (blackJack.calculateHandValue(playerHand) === 21) {
            game.status = "finished"
            const dealerFinalHand = blackJack.dealerPlay(
                game.dealer,
                game.dealer.hand,
                game.player.hand,
            )
            game.dealer.hand = dealerFinalHand
            game.dealer.value = blackJack.calculateHandValue(dealerFinalHand)
            game.dealer.bust = game.dealer.value > 21
            game.dealer.blackJack = game.dealer.value === 21

            const winner = blackJack.determinateWinner(
                blackJack.calculateHandValue(playerHand),
                blackJack.calculateHandValue(dealerFinalHand),
            )
            game.winners.push(winner)

            const payout = game.winners.includes("player")
                ? amount * 1.5 + amount
                : 0

            game.payout = payout

            if (game.winners.includes("player"))
                await User.updateUserBalance(id, payout)
            games.set(gameId, game)
        }

        //I hide the second card of the dealer hand and the deck from the response
        game.dealer.hand[1] = "Hidden"

        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const hit = (req, res) => {
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (game.player[0].resolved === true && split === true) {
            game.player[1].hand = blackJack.hit(game.deck, game.player[1].hand)
            game.player[1].value = blackJack.calculateHandValue(
                game.player[1].hand,
            )
            game.player[1].bust = game.player[1].value > 21

            if (game.player[1].bust) {
                game.player[1].resolved = true
                game.status = "finished"
                game.winners.push("dealer")
            }

            games.set(gameId, game)
        } else {
            game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
            game.player[0].value = blackJack.calculateHandValue(
                game.player[0].hand,
            )
            game.player[0].bust = game.player[0].value > 21

            if (game.player[0].bust && split === true) {
                game.player[0].resolved = true
                game.winners.push("dealer")
            } else {
                game.player[0].resolved = true
                game.winners.push("dealer")
                game.status = "finished"
            }

            games.set(gameId, game)
        }
        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const stand = async (req, res) => {
    const blackJack = createBlackJack()
    try {
        const id = req.user.id
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }
        //If there is a split, we have two branches of logic, one for the first hand and one for the second hand
        if (split === true) {
            //If the player is already resolved the first hand, and decides to stand with the second hand,
            //the dealer plays his hand and we determinate the winner of both hands
            if (game.player[0].resolved === true && split === true) {
                const dealerFinalHand = blackJack.dealerPlay(
                    game.deck,
                    game.dealer.hand,
                    game.player.hand,
                )
                game.dealer.hand = dealerFinalHand
                game.dealer.value =
                    blackJack.calculateHandValue(dealerFinalHand)
                game.dealer.bust = game.dealer.value > 21
                game.dealer.blackJack = game.dealer.value === 21

                const winner = blackJack.determinateWinner(
                    game.player.value,
                    game.dealer.value,
                )

                const winner2 = blackJack.determinateWinner(
                    game.player.value2,
                    game.dealer.value,
                )

                game.winners.push(winner)
                game.winners.push(winner2)
                game.status = "finished"

                if (game.winners.includes("player")) {
                    const payout = //I have to check if the first hand is doubled
                        game.winners[0] === "player" && game.player[0].doubled
                            ? game.player[0].bet * 2 + game.player[0].bet
                            : game.winners[0] === "player"
                              ? game.player[0].bet + game.player[0].bet
                              : 0

                    payout +=
                        game.winners[1] === "player"
                            ? game.player[1].bet + game.player[1].bet
                            : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }
                games.set(gameId, game)
            } else {
                //If the player decides to stand with the first hand, we just mark it as resolved
                //and wait for the player to play with the second hand
                game.player[0].resolved = true
                game.set(gameId, game)
            }
        } else {
            //If there is no split, the dealer plays his hand and we determinate the winner
            const dealerFinalHand = blackJack.dealerPlay(
                game.deck,
                game.dealer.hand,
                game.player[0].hand,
            )
            game.dealer.hand = dealerFinalHand
            game.dealer.value = blackJack.calculateHandValue(dealerFinalHand)
            game.dealer.bust = game.dealer.value > 21
            game.dealer.blackJack = game.dealer.value === 21

            const winner = blackJack.determinateWinner(
                game.player[0].value,
                game.dealer.value,
            )
            game.winner.push(winner)
            game.status = "finished"

            if (game.winners.includes("player")) {
                const payout =
                    game.winners[0] === "player"
                        ? game.player[0].bet + game.player[0].bet
                        : 0
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }

            games.set(gameId, game)
        }

        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//TODO: Implement the double split logic
export const double = async (req, res) => {
    const id = req.user.id
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)

        const wallet = await User.getUserBalance(id)
        if (game.player[0].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        await User.updateUserBalance(id, -game.player[0].bet)

        //If the game is not split we do the usual thing
        if (game.split === false) {
            const dealerFinalHand = blackJack.dealerPlay(
                game.deck,
                game.dealer.hand,
                game.player[0].hand,
            )
            game.dealer.hand = dealerFinalHand
            game.dealer.value = blackJack.calculateHandValue(dealerFinalHand)
            game.dealer.bust = game.dealer.value > 21
            game.dealer.blackJack = game.dealer.value === 21

            const winner = blackJack.determinateWinner(
                game.player[0].value,
                game.dealer.value,
            )

            game.winners.push(winner)
            game.status = "finished"

            if (game.winners.includes("player")) {
                const payout =
                    game.winners[0] === "player"
                        ? game.player[0].bet + game.player[0].bet
                        : 0
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }
        }
        //If the game is split we have to check a few things
        if (game.split === true) {
            //If the player has split and the first hand is already resolved, we double the second hand, if not we double the first hand
            if (game.player[0].resolved === true) {
                game.player[1].hand = blackJack.hit(
                    game.deck,
                    game.player[1].hand,
                )
                game.player[1].value = blackJack.calculateHandValue(
                    game.player[1].hand,
                )
                game.player[1].bust = game.player[1].value > 21
                game.player[1].resolved = true
                //TODO: Implement all the logic for the second double
            } else {
                // If the player decides to double with the first hand we have to check a few things too
                game.player[0].hand = blackJack.hit(
                    game.deck,
                    game.player[0].hand,
                )
                game.player[0].value = blackJack.calculateHandValue(
                    game.player[0].hand,
                )
                game.player[0].bust = game.player[0].value > 21
                game.player[0].resolved = true
                //If the player is busted we only set the winner of the hand and I mark the hand resolved
                if (game.player[0].bust) {
                    game.winners.push("dealer")
                }
                //Otherwise we wait to see what happens with the second hand
            }

            games.set(gameId, game)
        }

        res.json(game.filter((key) => key !== "deck"))
    } catch (error) {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const split = async (req, res) => {
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)

        const wallet = await User.getUserBalance(id)
        if (game.player[0].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }
        if (
            game.player.hand.length === 2 &&
            game.player.hand[0].value === game.player.hand[1].value
        ) {
            game.split = true
            const [splitHand1, splitHand2] = blackJack.split(game.player.hand)
            game.player[0].hand = splitHand1
            game.player[0].value = blackJack.calculateHandValue(splitHand1)
            game.player[0].bust = game.player[0].value > 21
            game.player[0].hand = [...hand, game.deck[0]]
            game.deck.shift()

            const hitHand2 = [...splitHand2, game.deck[0]]
            game.deck.shift()

            const newHand = {
                hand: hitHand2,
                value: blackJack.calculateHandValue(hitHand2),
                bust: blackJack.calculateHandValue(hitHand2) > 21,
                blackJack: false,
                doubled: false,
                resolved: false,
                bet: game.player[0].bet,
            }

            game.player.push(newHand)

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
