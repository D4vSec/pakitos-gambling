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

const isUserGameValid = (game, userId) => {
    if (game.userId !== userId) {
        return false
    }
    return true
}

export const startGame = async (req, res) => {
    const id = req.user.id
    const wallet = await User.getUserBalance(id)
    const { amount } = req.body

    if (amount <= 0 || isNaN(amount)) {
        return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
    }

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
            userId: id,
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
                    bet: amount,
                },
            ],
            dealer: [
                {
                    hand: dealerHand,
                    value: blackJack.calculateHandValue(dealerHand),
                    bust: blackJack.calculateHandValue(dealerHand) > 21,
                    blackjack: false,
                },
            ],
            deck: deck,
            winners: [],
            payout: 0,
        }

        //If the player hits a blackJack
        if (blackJack.calculateHandValue(playerHand) === 21) {
            game.status = "finished"
            game.player[0].blackjack = true
            if (blackJack.calculateHandValue(dealerHand) === 21) {
                game.dealer[0].blackjack = true
                game.winners.push("Tie")
            } else {
                game.winners.push("player")
                const payout = game.winners.includes("player") ? amount * 1.5 + amount : 0

                game.payout = payout

                if (game.winners.includes("player")) await User.updateUserBalance(id, payout)
            }
        }

        //If the dealer hits a blackJack
        if (blackJack.calculateHandValue(dealerHand) === 21 && blackJack.calculateHandValue(playerHand) !== 21) {
            game.status = "finished"
            game.dealer[0].blackjack = true
            game.winners.push("dealer")
        }

        games.set(gameId, game)

        // Create a copy for the response to avoid modifying the stored game state
        const responseGame = JSON.parse(JSON.stringify(game))

        //I hide the second card of the dealer hand and the deck from the response only if the game is ongoing
        if (responseGame.status !== "finished") {
            responseGame.dealer[0].hand[1] = { rank: "hidden", suit: "hidden" }
            responseGame.dealer[0].value = blackJack.calculateHandValue([responseGame.dealer[0].hand[0]])
        }
        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error starting game:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const hit = async (req, res) => {
    const blackJack = createBlackJack()
    try {
        const id = req.user.id
        const { gameId } = req.params
        const game = games.get(gameId)
        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }
        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }
        //TODO: HIT WITH SPLIT IS NOT WORKING
        if (game.split === true) {
            if (game.player[0].resolved === true) {
                game.player[1].hand = blackJack.hit(game.deck, game.player[1].hand)
                game.player[1].value = blackJack.calculateHandValue(game.player[1].hand)
                game.player[1].bust = game.player[1].value > 21
                game.player[1].blackjack = game.player[1].value === 21
                game.player[1].resolved = true

                if (game.player[1].bust) {
                    game.player[1].resolved = true
                    game.status = "finished"
                    game.winners.push("dealer")
                }

                if (game.player[1].blackjack) {
                    game.player[1].resolved = true
                    game.status = "finished"
                }
                if (game.status === "finished") {
                    const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[1].hand)
                    game.dealer[0].hand = dealerFinalHand
                    game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                    game.dealer[0].bust = game.dealer[0].value > 21
                    game.dealer[0].blackjack = game.dealer[0].value === 21

                    if (!game.player[0].bust) {
                        const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)
                        game.winners.push(winner)
                    }

                    if (!game.player[1].bust) {
                        const winner2 = blackJack.determinateWinner(game.player[1].value, game.dealer[0].value)
                        game.winners.push(winner2)
                    }

                    if (game.winners.includes("player")) {
                        let payout = //I have to check if the first hand is doubled
                            game.winners[0] === "player" && game.player[0].doubled
                                ? game.player[0].bet * 2 + game.player[0].bet
                                : game.winners[0] === "player" //If the first hand is not doubled I check if the player wins to pay the normal payout
                                  ? game.player[0].bet + game.player[0].bet
                                  : 0

                        payout += game.winners[1] === "player" ? game.player[1].bet + game.player[1].bet : 0

                        game.payout = payout

                        await User.updateUserBalance(id, payout)
                    }
                }
            } else {
                game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
                game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
                game.player[0].bust = game.player[0].value > 21
                game.player[0].blackjack = game.player[0].value === 21

                if (game.player[0].bust) {
                    game.player[0].resolved = true
                    game.winners.push("dealer")
                }

                if (game.player[0].blackjack) {
                    game.player[0].resolved = true
                }
            }
        }

        if (game.split === false) {
            game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
            game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
            game.player[0].bust = game.player[0].value > 21
            game.player[0].blackjack = game.player[0].value === 21
            game.player[0].resolved = true

            if (game.player[0].bust) {
                game.status = "finished"
                game.winners.push("dealer")
            }

            if (game.player[0].blackjack) {
                game.status = "finished"
                const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[0].hand)
                game.dealer[0].hand = dealerFinalHand
                game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                game.dealer[0].bust = game.dealer[0].value > 21
                game.dealer[0].blackjack = game.dealer[0].value === 21

                const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)
                game.winners.push(winner)

                if (game.winners.includes("player")) {
                    const payout = game.winners[0] === "player" ? game.player[0].bet + game.player[0].bet : 0
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
            }
        }

        games.set(gameId, game)

        // Create a copy for the response
        const responseGame = JSON.parse(JSON.stringify(game))

        // Hide dealer card if game is ongoing
        if (responseGame.status === "ongoing") {
            responseGame.dealer[0].hand[1] = { rank: "hidden", suit: "hidden" }
            responseGame.dealer[0].value = blackJack.calculateHandValue([responseGame.dealer[0].hand[0]])
        } else {
            // If finished, show real value (already present in game object, but ensure display is correct)
            // No specific action needed as responseGame has full hand
        }

        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error hitting:", error)
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
        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }
        //If there is a split, we have two branches of logic, one for the first hand and one for the second hand
        if (game.split === true) {
            //If the player is already resolved the first hand, and decides to stand with the second hand,
            //the dealer plays his hand and we determinate the winner of both hands
            if (game.player[0].resolved === true) {
                const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[0].hand)
                game.dealer[0].hand = dealerFinalHand
                game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                game.dealer[0].bust = game.dealer[0].value > 21
                game.dealer[0].blackjack = game.dealer[0].value === 21

                const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)

                const winner2 = blackJack.determinateWinner(game.player[1].value, game.dealer[0].value)

                game.winners.push(winner)
                game.winners.push(winner2)
                game.status = "finished"

                if (game.winners.includes("player")) {
                    let payout = //I have to check if the first hand is doubled
                        game.winners[0] === "player" && game.player[0].doubled
                            ? game.player[0].bet * 2 + game.player[0].bet
                            : game.winners[0] === "player" //If the first hand is not doubled I check if the player wins to pay the normal payout
                              ? game.player[0].bet + game.player[0].bet
                              : 0

                    payout += game.winners[1] === "player" ? game.player[1].bet + game.player[1].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }
                games.set(gameId, game)
            } else {
                //If the player decides to stand with the first hand, we just mark it as resolved
                //and wait for the player to play with the second hand
                game.player[0].resolved = true
                games.set(gameId, game)
            }
        } else {
            //If there is no split, the dealer plays his hand and we determinate the winner

            game.player[0].resolved = true

            const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[0].hand)
            game.dealer[0].hand = dealerFinalHand
            game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
            game.dealer[0].bust = game.dealer[0].value > 21
            game.dealer[0].blackjack = game.dealer[0].value === 21

            const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)
            game.winners.push(winner)
            game.status = "finished"

            if (game.winners.includes("player")) {
                const payout = game.winners[0] === "player" ? game.player[0].bet + game.player[0].bet : 0
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }

            games.set(gameId, game)
        }

        const responseGame = JSON.parse(JSON.stringify(game))

        // Hide dealer card if game is ongoing
        if (responseGame.status === "ongoing") {
            responseGame.dealer[0].hand[1] = { rank: "hidden", suit: "hidden" }
            responseGame.dealer[0].value = blackJack.calculateHandValue([responseGame.dealer[0].hand[0]])
        }

        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error standing:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

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

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        await User.updateUserBalance(id, -game.player[0].bet)
        game.player[0].bet *= 2
        //If the game is not split we do the usual thing
        if (game.split === false) {
            game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
            game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
            game.player[0].bust = game.player[0].value > 21
            game.player[0].doubled = true
            game.player[0].resolved = true

            if (!game.player[0].bust) {
                const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[0].hand)
                game.dealer[0].hand = dealerFinalHand
                game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                game.dealer[0].bust = game.dealer[0].value > 21
                game.dealer[0].blackjack = game.dealer[0].value === 21

                const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)

                game.winners.push(winner)
                game.status = "finished"

                if (game.winners.includes("player")) {
                    const payout = game.winners[0] === "player" ? game.player[0].bet * 2 + game.player[0].bet : 0
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
            } else {
                game.status = "finished"
                game.winners.push("dealer")
            }
            games.set(gameId, game)
        }
        //If the game is split we have to check a few things
        if (game.split === true) {
            //If the player has split and the first hand is already resolved, we double the second hand, if not we double the first hand
            if (game.player[0].resolved === true) {
                game.player[1].hand = blackJack.hit(game.deck, game.player[1].hand)
                game.player[1].value = blackJack.calculateHandValue(game.player[1].hand)
                game.player[1].bust = game.player[1].value > 21
                game.player[1].resolved = true

                const dealerFinalHand = blackJack.dealerPlay(game.deck, game.dealer[0].hand, game.player[0].hand)
                game.dealer[0].hand = dealerFinalHand
                game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                game.dealer[0].bust = game.dealer[0].value > 21
                game.dealer[0].blackjack = game.dealer[0].value === 21

                const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)

                game.winners.push(winner)
                game.status = "finished"

                if (game.winners.includes("player")) {
                    let payout = //I have to check if the first hand is doubled
                        game.winners[0] === "player" && game.player[0].doubled
                            ? game.player[0].bet * 2 + game.player[0].bet
                            : game.winners[0] === "player" //If the first hand is not doubled I check if the player wins to pay the normal payout
                              ? game.player[0].bet + game.player[0].bet
                              : 0

                    payout += game.winners[1] === "player" ? game.player[1].bet + game.player[1].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }

                games.set(gameId, game)
            } else {
                // If the player decides to double with the first hand we have to check a few things too
                game.player[0].hand = blackJack.hit(game.deck, game.player[0].hand)
                game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
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
        const responseGame = JSON.parse(JSON.stringify(game))
        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error doubling:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const split = async (req, res) => {
    const blackJack = createBlackJack()
    try {
        const id = req.user.id
        const { gameId } = req.params
        const game = games.get(gameId)

        const wallet = await User.getUserBalance(id)
        if (game.player[0].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (game.split === true) {
            return res.status(400).json({ code: "ALREADY_SPLIT" })
        }
        //DEV: I am skipping the check for the split condition for now, but in a real game the player can only split if the first two cards have the same rank
        if (/*game.player.hand.length === 2 && game.player.hand[0].value === game.player.hand[1].value*/ true) {
            game.split = true
            const [splitHand1, splitHand2] = blackJack.split(game.player[0].hand)
            game.player[0].hand = splitHand1
            game.player[0].hand = [...splitHand1, game.deck[0]]
            game.player[0].value = blackJack.calculateHandValue(game.player[0].hand)
            game.player[0].bust = game.player[0].value > 21
            game.player[0].blackjack = game.player[0].value === 21
            game.deck.shift()

            const hitHand2 = [...splitHand2, game.deck[0]]
            game.deck.shift()

            const newHand = {
                hand: hitHand2,
                value: blackJack.calculateHandValue(hitHand2),
                bust: blackJack.calculateHandValue(hitHand2) > 21,
                blackjack: blackJack.calculateHandValue(hitHand2) === 21,
                doubled: false,
                resolved: false,
                bet: game.player[0].bet,
            }

            game.player.push(newHand)

            if (game.player[0].blackjack) {
                // If the first hand is a blackjack, we can immediately resolve the hand
                game.player[0].resolved = true
            }

            if (game.player[0].blackjack && game.player[1].blackjack) {
                // If both hands are blackjack, we can immediately resolve the hand
                game.player[1].resolved = true
                game.status = "finished"

                const dealerFinalHand = blackJack.dealerPlaySplit(game.deck, game.dealer[0].hand, game.player[0].hand, game.player[1].hand)
                game.dealer[0].hand = dealerFinalHand
                game.dealer[0].value = blackJack.calculateHandValue(dealerFinalHand)
                game.dealer[0].bust = game.dealer[0].value > 21
                game.dealer[0].blackjack = game.dealer[0].value === 21

                const winner = blackJack.determinateWinner(game.player[0].value, game.dealer[0].value)

                const winner2 = blackJack.determinateWinner(game.player[1].value, game.dealer[0].value)

                game.winners.push(winner)
                game.winners.push(winner2)

                if (game.winners.includes("player")) {
                    let payout = game.winners[0] === "player" ? game.player[0].bet + game.player[0].bet : 0

                    payout += game.winners[1] === "player" ? game.player[1].bet + game.player[1].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }
            }

            games.set(gameId, game)

            const responseGame = JSON.parse(JSON.stringify(game))

            //I hide the second card of the dealer hand and the deck from the response only if the game is ongoing
            if (responseGame.status !== "finished") {
                responseGame.dealer[0].hand[1] = {
                    rank: "hidden",
                    suit: "hidden",
                }
                responseGame.dealer[0].value = blackJack.calculateHandValue([responseGame.dealer[0].hand[0]])
            }
            res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
        } else {
            return res.status(400).json({ code: "CANNOT_SPLIT" })
        }
    } catch (error) {
        console.error("Error splitting:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const deleteGame = (req, res) => {
    try {
        const id = req.user.id
        const { gameId } = req.params

        const game = games.get(gameId)
        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        games.delete(gameId)
        res.status(200).json({ code: "GAME_DELETED_SUCCESSFULLY" })
    } catch (error) {
        console.error("Error deleting game:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const getGame = (req, res) => {
    try {
        const id = req.user.id
        const { gameId } = req.params

        const game = games.get(gameId)
        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        res.status(200).json(Object.fromEntries(Object.entries(game).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error getting game:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//DEV:This method is just for testing purposes, it will not be here in the final version
export const getGames = (req, res) => {
    try {
        const gamesArray = Array.from(games.values())
        res.status(200).json(gamesArray)
    } catch (error) {
        console.error("Error getting games:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
