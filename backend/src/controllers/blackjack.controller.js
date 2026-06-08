import createBlackJack from "#services/blackjack.service"
import User from "#models/user.model"
import Audit from "#services/audit.service"
import logger from "#utils/logger.utils"
import { randomUUID } from "#utils/rng.utils"

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
    const gameId = randomUUID()

    try {
        await User.updateUserBalance(id, -amount, { type: "BET" })

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
            game.player[FIRST_HAND].resolved = true

            if (blackJack.calculateHandValue(dealerHand) === 21) {
                game.dealer[DEALER_HAND].blackjack = true
                game.winners.push(winners.tie)
            } else {
                game.winners.push(winners.player)
            }
            let result = blackJack.getPayout(game, FIRST_HAND, true)
            game.payout = result ? result.payout : 0
            if (game.payout > 0)
                await User.updateUserBalance(id, game.payout, { type: result.type })
        }

        //If the dealer hits a blackJack
        if (
            blackJack.calculateHandValue(dealerHand) === 21 &&
            blackJack.calculateHandValue(playerHand) !== 21
        ) {
            game.status = GAME_STATUSES.finished
            game.dealer[DEALER_HAND].blackjack = true
            game.dealer[DEALER_HAND].resolved = true
            game.winners.push(winners.dealer)
        }

        games.set(gameId, game)

        // Create a copy for the response to avoid modifying the stored game state and hide the dealer card and the deck from the response
        const responseGame = blackJack.hideDealerCard(dealerHand, game)

        if (game.status === GAME_STATUSES.finished) {
            const deviceInfo = Audit.getUserAgentRaw(req)
            await Audit.createAudit({
                user_id: id,
                action: "GAME_RESULT",
                details: {
                    type: "BLACKJACK",
                    bets: game.player.map((hand) => ({ bet: hand.bet, hand: hand.hand })),
                    dealerHand: game.dealer[DEALER_HAND].hand,
                    playerHand: game.player.map((hand) => hand.hand),
                    winners: game.winners,
                    payout: game.payout,
                    date: new Date().toISOString(),
                },
                ip_address: Audit.getClientIp(req),
                user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
            })
        }

        res.status(200).json(
            Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
        )
    } catch (error) {
        console.error(error)
        //logger.error("Error starting game: ", error)
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
        
        if (game.split) {
            if (game.player[FIRST_HAND].resolved) {
                game.player[SECOND_HAND].hand = blackJack.hit(
                    game.deck,
                    game.player[SECOND_HAND].hand,
                )

                game.player[SECOND_HAND] = blackJack.setHand(game.player[SECOND_HAND]) 

                if (game.player[SECOND_HAND].bust) {
                    game.status = GAME_STATUSES.finished
                    game.winners.push(winners.dealer)
                }

                if (game.player[SECOND_HAND].blackjack) {
                    game.status = GAME_STATUSES.finished
                }

                if (game.status === GAME_STATUSES.finished) {
                    if (!game.player[FIRST_HAND].bust || !game.player[SECOND_HAND].bust) {
                        game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                            game.deck,
                            game.dealer[DEALER_HAND].hand,
                        )
                        game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])
                    }

                    if (!game.player[FIRST_HAND].bust) {
                        const winner = blackJack.determinateWinner(
                            game.player[FIRST_HAND].value,
                            game.dealer[DEALER_HAND].value,
                        )
                        game.winners.push(winner)
                    }

                    if (!game.player[SECOND_HAND].bust) {
                        const winner2 = blackJack.determinateWinner(
                            game.player[SECOND_HAND].value,
                            game.dealer[DEALER_HAND].value,
                        )
                        game.winners.push(winner2)
                    }

                    let result = blackJack.getPayout(game, FIRST_HAND)
                    console.log(result)
                    let result2 = blackJack.getPayout(game, SECOND_HAND)
                    console.log(result2)

                    game.payout = (result ? result.payout : 0) + (result2 ? result2.payout : 0)

                    if (result.payout > 0)
                        await User.updateUserBalance(id, result.payout, { type: result.type })
                    if (result2.payout > 0)
                        await User.updateUserBalance(id, result2.payout, { type: result2.type })
                }
            } else {
                game.player[FIRST_HAND].hand = blackJack.hit(
                    game.deck,
                    game.player[FIRST_HAND].hand,
                )

                game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

                if (game.player[FIRST_HAND].bust) game.winners.push(winners.dealer)
            }
        } else {
            game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)

            game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

            if (game.player[FIRST_HAND].bust) {
                game.status = GAME_STATUSES.finished
                game.winners.push(winners.dealer)
            }

            if (game.player[FIRST_HAND].blackjack) {
                game.status = GAME_STATUSES.finished

                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                    game.deck,
                    game.dealer[DEALER_HAND].hand,
                )
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(
                    game.player[FIRST_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )
                game.winners.push(winner)
                let result = blackJack.getPayout(game, FIRST_HAND)
                game.payout = result ? result.payout : 0
                if (game.payout > 0)
                    await User.updateUserBalance(id, game.payout, { type: result.type })
            }
        }

        games.set(gameId, game)

        // Create a copy for the response
        const responseGame = blackJack.hideDealerCard(game.dealer[DEALER_HAND].hand, game)

        if (game.status === GAME_STATUSES.finished) {
            const deviceInfo = Audit.getUserAgentRaw(req)
            await Audit.createAudit({
                user_id: id,
                action: "GAME_RESULT",
                details: {
                    type: "BLACKJACK",
                    bets: game.player.map((hand) => ({ bet: hand.bet, hand: hand.hand })),
                    dealerHand: game.dealer[DEALER_HAND].hand,
                    playerHand: game.player.map((hand) => hand.hand),
                    winners: game.winners,
                    payout: game.payout,
                    date: new Date().toISOString(),
                },
                ip_address: Audit.getClientIp(req),
                user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
            })
        }

        res.status(200).json(
            Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
        )
    } catch (error) {
        console.log(error)
        logger.error("Error hitting:", error)
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

                game.player[SECOND_HAND].resolved = true
            
                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                    game.deck,
                    game.dealer[DEALER_HAND].hand
                )
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(
                    game.player[FIRST_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )

                const winner2 = blackJack.determinateWinner(
                    game.player[SECOND_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )

                game.winners.push(winner)
                game.winners.push(winner2)
                game.status = GAME_STATUSES.finished

                const results = blackJack.getPayout(game, FIRST_HAND, false)
                const results2 = blackJack.getPayout(game, SECOND_HAND, false)
                game.payout = (results ? results.payout : 0) + (results2 ? results2.payout : 0)
                if (results.payout > 0)
                    await User.updateUserBalance(id, results.payout, { type: results.type })
                if (results2.payout > 0)
                    await User.updateUserBalance(id, results2.payout, { type: results2.type })
            } else {
                //If the player decides to stand with the first hand, we just mark it as resolved
                //and wait for the player to play with the second hand
                game.player[FIRST_HAND].resolved = true
            }
        } else {
            //If there is no split, the dealer plays his hand and we determinate the winner
            game.player[FIRST_HAND].resolved = true

            game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                game.deck,
                game.dealer[DEALER_HAND].hand
            )
            game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

            const winner = blackJack.determinateWinner(
                game.player[FIRST_HAND].value,
                game.dealer[DEALER_HAND].value,
            )
            game.winners.push(winner)
            game.status = GAME_STATUSES.finished

            const result = blackJack.getPayout(game, FIRST_HAND)

            game.payout = result ? result.payout : 0
            if (game.payout > 0)
                await User.updateUserBalance(id, game.payout, { type: result.type })
        }

        games.set(gameId, game)

        const responseGame = blackJack.hideDealerCard(game.dealerHand, game)

        if (game.status === GAME_STATUSES.finished) {
            const deviceInfo = Audit.getUserAgentRaw(req)
            await Audit.createAudit({
                user_id: id,
                action: "GAME_RESULT",
                details: {
                    type: "BLACKJACK",
                    bets: game.player.map((hand) => ({ bet: hand.bet, hand: hand.hand })),
                    dealerHand: game.dealer[DEALER_HAND].hand,
                    playerHand: game.player.map((hand) => hand.hand),
                    winners: game.winners,
                    payout: game.payout,
                    date: new Date().toISOString(),
                },
                ip_address: Audit.getClientIp(req),
                user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
            })
        }

        res.status(200).json(
            Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
        )
    } catch (error) {
        console.log(error)
        logger.error({ message: "Error standing:", error })
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
        if (game.player[FIRST_HAND].bet > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        await User.updateUserBalance(id, -game.player[FIRST_HAND].bet, { type: "BET" })
        
        //If the game is not split we do the usual thing
        if (!game.split) {
            if (game.player[FIRST_HAND].hand.length !== 2) {
                await User.updateUserBalance(id, game.player[FIRST_HAND].bet / 2, {
                    type: "REFUND",
                })
                return res.status(400).json({ code: "CANNOT_DOUBLE" })
            }

            game.player[FIRST_HAND].resolved = true

            game.player[FIRST_HAND].bet *= 2

            game.player[FIRST_HAND].hand = blackJack.hit(game.deck, game.player[FIRST_HAND].hand)
            game.player[FIRST_HAND].doubled = true
            game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])

            if (!game.player[FIRST_HAND].bust) {
                console.log(game.dealer[DEALER_HAND].hand)
                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                    game.deck,
                    game.dealer[DEALER_HAND].hand,
                )
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(
                    game.player[FIRST_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )

                game.winners.push(winner)
                game.status = GAME_STATUSES.finished

                let result = blackJack.getPayout(game, FIRST_HAND, false)
                game.payout = result ? result.payout : 0
                if (game.payout > 0)
                    await User.updateUserBalance(id, game.payout, { type: result.type })
            } else {
                game.status = GAME_STATUSES.finished
                game.winners.push(winners.dealer)
            }
        } else {
            //If the player has split and the first hand is already resolved, we double the second hand, if not we double the first hand)
            if (game.player[FIRST_HAND].resolved) {
                if (game.player[SECOND_HAND].hand.length !== 2) {
                    await User.updateUserBalance(id, game.player[SECOND_HAND].bet / 2, {
                        type: "REFUND",
                    })
                    return res.status(400).json({ code: "CANNOT_DOUBLE" })
                }

                game.player[SECOND_HAND].resolved = true

                game.player[SECOND_HAND].bet *= 2

                game.player[SECOND_HAND].hand = blackJack.hit(
                    game.deck,
                    game.player[SECOND_HAND].hand,
                )
                game.player[SECOND_HAND].doubled = true
                game.player[SECOND_HAND] = blackJack.setHand(game.player[SECOND_HAND])

                if (!game.player[SECOND_HAND].bust) {
                    game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                        game.deck,
                        game.dealer[DEALER_HAND].hand,
                    )
                    game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])
                    const winner = blackJack.determinateWinner(
                        game.player[FIRST_HAND].value,
                        game.dealer[DEALER_HAND].value,
                    )

                    const winner2 = blackJack.determinateWinner(
                        game.player[SECOND_HAND].value,
                        game.dealer[DEALER_HAND].value,
                    )

                    game.winners.push(winner)
                    game.winners.push(winner2)
                    game.status = GAME_STATUSES.finished

                    const results = blackJack.getPayout(game, FIRST_HAND, false)
                    const results2 = blackJack.getPayout(game, SECOND_HAND, false)
                    game.payout = (results ? results.payout : 0) + (results2 ? results2.payout : 0)
                    if (results.payout > 0)
                        await User.updateUserBalance(id, results.payout, { type: results.type })
                    if (results2.payout > 0)
                        await User.updateUserBalance(id, results2.payout, { type: results2.type })
                } else {
                    game.status = GAME_STATUSES.finished
                    game.winners.push(winners.dealer)
                }
            }

            if (!game.player[FIRST_HAND].resolved) {
                if (game.player[FIRST_HAND].hand.length !== 2) {
                    await User.updateUserBalance(id, game.player[FIRST_HAND].bet / 2, {
                        type: "REFUND",
                    })
                    return res.status(400).json({ code: "CANNOT_DOUBLE" })
                }

                game.player[FIRST_HAND].resolved = true

                game.player[FIRST_HAND].bet *= 2
                // If the player decides to double with the first hand we have to check a few things too
                game.player[FIRST_HAND].hand = blackJack.hit(
                    game.deck,
                    game.player[FIRST_HAND].hand,
                )
                game.player[FIRST_HAND].doubled = true
                game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])
                //If the player is busted we only set the winner of the hand and I mark the hand resolved
                if (game.player[FIRST_HAND].bust) {
                    game.winners.push(winners.dealer)
                }
                //Otherwise we wait to see what happens with the second hand
            }
        }

        games.set(gameId, game)

        const responseGame = JSON.parse(JSON.stringify(game))

        if (game.status === GAME_STATUSES.finished) {
            const deviceInfo = Audit.getUserAgentRaw(req)
            await Audit.createAudit({
                user_id: id,
                action: "GAME_RESULT",
                details: {
                    type: "BLACKJACK",
                    bets: game.player.map((hand) => ({ bet: hand.bet, hand: hand.hand })),
                    dealerHand: game.dealer[DEALER_HAND].hand,
                    playerHand: game.player.map((hand) => hand.hand),
                    winners: game.winners,
                    payout: game.payout,
                    date: new Date().toISOString(),
                },
                ip_address: Audit.getClientIp(req),
                user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
            })
        }

        res.status(200).json(
            Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
        )
    } catch (error) {
        console.log(error)
        logger.error("Error doubling:", error)
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

        if (game.player[FIRST_HAND].hand.length !== 2) {
            return res.status(400).json({ code: "CANNOT_SPLIT" })
        }

        const firstHandValue = blackJack.calculateHandValue([game.player[FIRST_HAND].hand[0]])
        const secondHandValue = blackJack.calculateHandValue([game.player[FIRST_HAND].hand[1]])
        if (
            game.player[FIRST_HAND].hand.length === 2 && firstHandValue === secondHandValue
        ) {
            await User.updateUserBalance(id, -game.player[FIRST_HAND].bet, { type: "BET" })
            game.split = true
            const [splitHand1, splitHand2] = blackJack.split(game.player[FIRST_HAND].hand)
            game.player[FIRST_HAND].hand = splitHand1
            game.player[FIRST_HAND].hand = [...splitHand1, game.deck[0]]
            game.player[FIRST_HAND] = blackJack.setHand(game.player[FIRST_HAND])
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

            if (game.player[SECOND_HAND].blackjack) {
                // If the second hand is a blackjack, we can immediately resolve the hand
                game.player[SECOND_HAND].resolved = true
            }

            if (game.player[FIRST_HAND].blackjack && game.player[SECOND_HAND].blackjack) {
                // If both hands are blackjack, we can immediately resolve the hand
                game.player[SECOND_HAND].resolved = true
                game.status = GAME_STATUSES.finished

                game.dealer[DEALER_HAND].hand = blackJack.dealerPlay(
                    game.deck,
                    game.dealer[DEALER_HAND].hand
                )
                game.dealer[DEALER_HAND] = blackJack.setHand(game.dealer[DEALER_HAND])

                const winner = blackJack.determinateWinner(
                    game.player[FIRST_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )

                const winner2 = blackJack.determinateWinner(
                    game.player[SECOND_HAND].value,
                    game.dealer[DEALER_HAND].value,
                )

                game.winners.push(winner)
                game.winners.push(winner2)

                const results = blackJack.getPayout(game, FIRST_HAND)
                const results2 = blackJack.getPayout(game, SECOND_HAND)

                game.payout = (results ? results.payout : 0) + (results2 ? results2.payout : 0)

                if (results.payout > 0)
                    await User.updateUserBalance(id, results.payout, { type: results.type })
                if (results2.payout > 0)
                    await User.updateUserBalance(id, results2.payout, { type: results2.type })
            }

            games.set(gameId, game)

            const responseGame = blackJack.hideDealerCard(game.dealerHand, game)

            if (game.status === GAME_STATUSES.finished) {
                const deviceInfo = Audit.getUserAgentRaw(req)
                await Audit.createAudit({
                    user_id: id,
                    action: "GAME_RESULT",
                    details: {
                        type: "BLACKJACK",
                        bets: game.player.map((hand) => ({ bet: hand.bet, hand: hand.hand })),
                        dealerHand: game.dealer[DEALER_HAND].hand,
                        playerHand: game.player.map((hand) => hand.hand),
                        winners: game.winners,
                        payout: game.payout,
                        date: new Date().toISOString(),
                    },
                    ip_address: Audit.getClientIp(req),
                    user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
                })
            }

            res.status(200).json(
                Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
            )
        } else {
            return res.status(400).json({ code: "CANNOT_SPLIT" })
        }
    } catch (error) {
        console.log(error)
        logger.error("Error splitting:", error)
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
        logger.error("Error deleting game:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const getGame = (req, res) => {
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

        if (!games.has(gameId)) return res.status(404).json({ code: "GAME_NOT_FOUND" })

        const responseGame = blackJack.hideDealerCard(game.dealerHand, game)

        res.status(200).json(
            Object.fromEntries(Object.entries(responseGame).filter(([key]) => key !== "deck")),
        )
    } catch (error) {
        logger.error("Error getting game:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//DEV:This method is just for testing purposes, it will not be here in the final version
export const getGames = (req, res) => {
    try {
        const gamesArray = Array.from(games.values())
        res.status(200).json(gamesArray)
    } catch (error) {
        logger.error("Error getting games:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}
