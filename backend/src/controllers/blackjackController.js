import createBlackJack from "#services/blackjack"
import User from "#models/userModel"

const games = new Map()

const FIRST_HAND = 0
const SECOND_HAND = 1

const DEALER_HAND = 0

const FIRST_WINNER = 0
const SECOND_WINNER = 1

const GAME_STATUSES = {
    ongoing: "ongoing",
    finished: "finished",
}

const winners = {
    player: "player",
    dealer: "dealer",
    tie: "tie",
}

const isGameValid = (gameId, game) => {
    if (!games.has(gameId)) {
        return false
    }
    if (game.status === GAME_STATUSES.finished) {
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
            status: GAME_STATUSES.ongoing, // ongoing | finished
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
                    resolved: false,
                },
            ],
            deck: deck,
            winners: [],
            payout: 0,
        }

        //If the player hits a blackJack
        if (blackJack.calculateHandValue(playerHand) === 21) {
            game.status = GAME_STATUSES.finished
            game.player[FIRST_HAND].blackjack = true

            if (blackJack.calculateHandValue(dealerHand) === 21) {
                game.dealer[DEALER_HAND].blackjack = true
                game.winners.push(winners.tie)
                const payout = game.player[FIRST_HAND].bet
                game.payout = game.player[FIRST_HAND].bet
                await User.updateUserBalance(id, payout)
            }
        }

        //If the dealer hits a blackJack
        if (blackJack.calculateHandValue(dealerHand) === 21 && blackJack.calculateHandValue(playerHand) !== 21) {
            game.status = GAME_STATUSES.finished
            game.dealer[DEALER_HAND].blackjack = true
            game.winners.push(winners.dealer)
        }

        games.set(gameId, game)

        // Create a copy for the response to avoid modifying the stored game state and hide the dealer card and the deck from the response
        const responseGame = hideDealerCard(dealerHand, game)

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
        if (game.split) {
            if (game.player[FIRST_HAND].resolved) {
                game.player[SECOND_HAND].hand = blackJack.hit(game.deck, game.player[SECOND_HAND].hand)

                game.player[SECOND_HAND] = blackJack.setHand(game.player[SECOND_HAND]) //TODO: Maybe I can abstract this logic since it is repeated a lot of times in the code

                if (game.player[SECOND_HAND].bust) {
                    game.status = GAME_STATUSES.finished
                    game.winners.push(winners.dealer)
                }

                if (game.player[SECOND_HAND].blackjack) {
                    game.status = GAME_STATUSES.finished
                }

                if (game.status === GAME_STATUSES.finished) {
                    game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)

                    game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND]) //TODO: Maybe I can abstract this logic since it is repeated a lot of times in the code

                    if (!game.player[FIRST_HAND].bust) {
                        const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)
                        game.winners.push(winner)
                    }

                    if (!game.player[SECOND_HAND].bust) {
                        const winner2 = blackJack.determinateWinner(game.player[SECOND_HAND].value, game.dealer[DEALER_HAND].value)
                        game.winners.push(winner2)
                    }

                    //TODO: Maybe I can simplify this logic, it is a bit hard to read, I have to check if the player wins with the first hand and if the hand is doubled to pay the correct payout, then I check if the player wins with the second hand to pay that payout and then I check if there is a tie in any of the hands to pay the correct payout in that case
                    //TODO: Also abstract this logic to a function since it is repeated in a lot of places in the code
                    if (game.winners.includes(winners.player)) {
                        let payout = //I have to check if the first hand is doubled
                            game.winners[FIRST_WINNER] === winners.player && game.player[FIRST_HAND].doubled
                                ? game.player[FIRST_HAND].bet * 2 + game.player[FIRST_HAND].bet
                                : game.winners[FIRST_WINNER] === winners.player //If the first hand is not doubled I check if the player wins to pay the normal payout
                                  ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet
                                  : 0

                        payout += game.winners[SECOND_WINNER] === winners.player ? game.player[SECOND_HAND].bet + game.player[SECOND_HAND].bet : 0

                        game.payout = payout

                        await User.updateUserBalance(id, payout)
                    }
                    //TODO: Abstract this logic?
                    if (game.winners[FIRST_WINNER] === winners.tie) {
                        payout = game.player[FIRST_HAND].bet
                        game.payout = payout
                        await User.updateUserBalance(id, payout)
                    }
                    if (game.winners[SECOND_WINNER] === winners.tie) {
                        payout += game.player[SECOND_HAND].bet
                        game.payout = payout
                        await User.updateUserBalance(id, payout)
                    }
                }
            } else {
                game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)

                game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

                if (game.player[FIRST_HAND].bust) game.winners.push(winners.dealer)
            }
        }

        if (!game.split) {
            game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)

            game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

            if (game.player[FIRST_HAND].bust) game.winners.push(winners.dealer)
        }

        if (game.player[FIRST_HAND].bust) {
            game.status = GAME_STATUSES.finished
            game.winners.push(winners.dealer)
        }

        if (game.player[FIRST_HAND].blackjack) {
            game.status = GAME_STATUSES.finished

            game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
            game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

            const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)
            game.winners.push(winner)

            if (game.winners.includes(winners.player)) {
                const payout = game.winners[FIRST_WINNER] === winners.player ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet : 0
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }

            if (game.winners[FIRST_WINNER] === winners.tie) {
                payout = game.player[FIRST_HAND].bet
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }
        }

        games.set(gameId, game)

        // Create a copy for the response
        const responseGame = hideDealerCard(dealerHand, game)

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
        if (game.split) {
            //If the player is already resolved the first hand, and decides to stand with the second hand,
            //the dealer plays his hand and we determinate the winner of both hands
            if (game.player[FIRST_HAND].resolved) {
                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)

                const winner2 = blackJack.determinateWinner(game.player[SECOND_HAND].value, game.dealer[DEALER_HAND].value)

                game.winners.push(winner)
                game.winners.push(winner2)
                game.status = GAME_STATUSES.finished

                if (game.winners.includes(winners.player)) {
                    let payout = //I have to check if the first hand is doubled
                        game.winners[FIRST_WINNER] === winners.player && game.player[FIRST_HAND].doubled
                            ? game.player[FIRST_HAND].bet * 2 + game.player[FIRST_HAND].bet
                            : game.winners[FIRST_WINNER] === winners.player //If the first hand is not doubled I check if the player wins to pay the normal payout
                              ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet
                              : 0

                    payout += game.winners[SECOND_WINNER] === winners.player ? game.player[SECOND_HAND].bet + game.player[SECOND_HAND].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }

                if (game.winners[FIRST_WINNER] === winners.tie) {
                    payout = game.player[FIRST_HAND].bet
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
                if (game.winners[SECOND_WINNER] === winners.tie) {
                    payout += game.player[SECOND_HAND].bet
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }

                games.set(gameId, game)
            } else {
                //If the player decides to stand with the first hand, we just mark it as resolved
                //and wait for the player to play with the second hand
                game.player[FIRST_HAND].resolved = true
                games.set(gameId, game)
            }
        } else {
            //If there is no split, the dealer plays his hand and we determinate the winner
            game.player[FIRST_HAND].resolved = true

            game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
            game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

            const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)
            game.winners.push(winner)
            game.status = GAME_STATUSES.finished

            if (game.winners.includes(winners.player)) {
                const payout = game.winners[FIRST_WINNER] === winners.player ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet : 0
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }

            if (game.winners[FIRST_WINNER] === winners.tie) {
                payout = game.player[FIRST_HAND].bet
                game.payout = payout
                await User.updateUserBalance(id, payout)
            }

            games.set(gameId, game)
        }

        const responseGame = hideDealerCard(dealerHand, game)

        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
    } catch (error) {
        console.error("Error standing:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
//TODO: Keep refactorizing the setHand()
export const double = async (req, res) => {
    const id = req.user.id
    const blackJack = createBlackJack()
    try {
        const { gameId } = req.params
        const game = games.get(gameId)

        const wallet = await User.getUserBalance(id)
        if (game.player[FIRST_HAND].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        await User.updateUserBalance(id, -game.player[FIRST_HAND].bet)
        game.player[FIRST_HAND].bet *= 2
        //If the game is not split we do the usual thing
        if (!game.split) {
            game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)
            game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

            game.player[FIRST_HAND].resolved = true
            game.player[FIRST_HAND].doubled = true

            if (!game.player[FIRST_HAND].bust) {
                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)

                game.winners.push(winner)
                game.status = GAME_STATUSES.finished

                if (game.winners.includes(winners.player)) {
                    const payout = game.winners[FIRST_WINNER] === winners.player ? game.player[FIRST_HAND].bet * 2 + game.player[FIRST_HAND].bet : 0
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }

                if (game.winners[FIRST_WINNER] === winners.tie) {
                    payout = game.player[FIRST_HAND].bet * 2
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
            } else {
                game.status = GAME_STATUSES.finished
                game.winners.push(winners.dealer)
            }
            games.set(gameId, game)
        }
        //If the game is split we have to check a few things
        if (game.split) {
            //If the player has split and the first hand is already resolved, we double the second hand, if not we double the first hand
            if (game.player[FIRST_HAND].resolved) {
                game.player[SECOND_HAND].hand = blackJack.hit(game.deck, game.player[SECOND_HAND].hand)
                game.player[SECOND_HAND].value = blackJack.calculateHandValue(game.player[SECOND_HAND].hand)
                game.player[SECOND_HAND].bust = game.player[SECOND_HAND].value > 21
                game.player[SECOND_HAND].resolved = true

                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)

                game.winners.push(winner)
                game.status = GAME_STATUSES.finished

                if (game.winners.includes(winners.player)) {
                    let payout = //I have to check if the first hand is doubled
                        game.winners[FIRST_WINNER] === winners.player && game.player[FIRST_HAND].doubled
                            ? game.player[FIRST_HAND].bet * 2 + game.player[FIRST_HAND].bet
                            : game.winners[FIRST_WINNER] === winners.player //If the first hand is not doubled I check if the player wins to pay the normal payout
                              ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet
                              : 0

                    payout += game.winners[SECOND_WINNER] === winners.player ? game.player[SECOND_HAND].bet + game.player[SECOND_HAND].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }

                if (game.winners[FIRST_WINNER] === winners.tie) {
                    payout = game.player[FIRST_HAND].bet * 2
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
                if (game.winners[SECOND_WINNER] === winners.tie) {
                    payout += game.player[SECOND_HAND].bet * 2
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }

                games.set(gameId, game)
            } else {
                // If the player decides to double with the first hand we have to check a few things too
                game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)
                game.player[FIRST_HAND].value = blackJack.calculateHandValue(game.player[FIRST_HAND].hand)
                game.player[FIRST_HAND].bust = game.player[FIRST_HAND].value > 21
                game.player[FIRST_HAND].resolved = true
                //If the player is busted we only set the winner of the hand and I mark the hand resolved
                if (game.player[FIRST_HAND].bust) {
                    game.winners.push(winners.dealer)
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
        if (game.player[FIRST_HAND].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (game.split) {
            return res.status(400).json({ code: "ALREADY_SPLIT" })
        }
        //DEV: I am skipping the check for the split condition for now, but in a real game the player can only split if the first two cards have the same rank
        if (/*game.player.hand.length === 2 && game.player.hand[0].value === game.player.hand[1].value*/ true) {
            game.split = true
            const [splitHand1, splitHand2] = blackJack.split(game.player[FIRST_HAND].hand)
            game.player[FIRST_HAND].hand = splitHand1
            game.player[FIRST_HAND].hand = [...splitHand1, game.deck[0]]
            game.player[FIRST_HAND].value = blackJack.calculateHandValue(game.player[FIRST_HAND].hand)
            game.player[FIRST_HAND].bust = game.player[FIRST_HAND].value > 21
            game.player[FIRST_HAND].blackjack = game.player[FIRST_HAND].value === 21
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
                bet: game.player[FIRST_HAND].bet,
            }

            game.player.push(newHand)

            if (game.player[FIRST_HAND].blackjack) {
                // If the first hand is a blackjack, we can immediately resolve the hand
                game.player[FIRST_HAND].resolved = true
            }

            if (game.player[FIRST_HAND].blackjack && game.player[SECOND_HAND].blackjack) {
                // If both hands are blackjack, we can immediately resolve the hand
                game.player[SECOND_HAND].resolved = true
                game.status = GAME_STATUSES.finished

                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(game.deck, game.dealer[DEALER_HAND].hand, game.player[SECOND_HAND].hand)
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(game.player[FIRST_HAND].value, game.dealer[DEALER_HAND].value)

                const winner2 = blackJack.determinateWinner(game.player[SECOND_HAND].value, game.dealer[DEALER_HAND].value)

                game.winners.push(winner)
                game.winners.push(winner2)

                if (game.winners.includes(winners.player)) {
                    let payout = game.winners[FIRST_WINNER] === winners.player ? game.player[FIRST_HAND].bet + game.player[FIRST_HAND].bet : 0

                    payout += game.winners[SECOND_WINNER] === winners.player ? game.player[SECOND_HAND].bet + game.player[SECOND_HAND].bet : 0

                    game.payout = payout

                    await User.updateUserBalance(id, payout)
                }

                if (game.winners[FIRST_WINNER] === winners.tie) {
                    payout = game.player[FIRST_HAND].bet
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
                if (game.winners[SECOND_WINNER] === winners.tie) {
                    payout += game.player[SECOND_HAND].bet
                    game.payout = payout
                    await User.updateUserBalance(id, payout)
                }
            }

            games.set(gameId, game)

            const responseGame = hideDealerCard(dealerHand, game)

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

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (!games.has(gameId)) return res.status(404).json({ code: "GAME_NOT_FOUND" })

        const responseGame = hideDealerCard(dealerHand, game)

        res.status(200).json(Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")))
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
