import { randomInt } from "#utils/rng.utils"

//This factory contains all the necessary functions to manage the logic of the BlackJack
const createBlackJack = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
    const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    const createDeck = () => {
        let deck = []
        for (let suit of suits) {
            for (let card of cards) {
                deck.push({ rank: card, suit: suit })
            }
        }
        return deck
    }
    //Fisher-Yates shuffle algorithm
    const shuffleDeck = (deck) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = randomInt(0, i + 1)
                ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }
        return deck
    }

    const calculateHandValue = (hand) => {
        let value = 0
        let aceCount = 0

        for (let card of hand) {
            if (card.rank === "A") {
                aceCount += 1
                value += 11
            } else if (["J", "Q", "K"].includes(card.rank)) {
                value += 10
            } else {
                value += parseInt(card.rank)
            }
        }
        //Due the ace value can be 1 or 11 if the value exceed 21 it will count as 1 instead of 11
        while (value > 21 && aceCount > 0) {
            value -= 10
            aceCount -= 1
        }

        return value
    }

    //First two cards for player and dealer
    const getInitialHand = (deck) => {
        let hand = []
        for (let i = 0; i < 2; i++) {
            hand = [...hand, deck[0]]
            deck.shift()
        }
        return hand
    }

    //Player decisions
    const hit = (deck, hand) => {
        hand = [...hand, deck[0]]
        deck.shift()
        return hand
    }

    const double = (deck, playerHand) => {
        playerHand = [...playerHand, deck[0]]
        deck.shift()
        return playerHand
    }
    //DEV: The split function is currently allowing to split any hand, but in a real game the player can only split if the first two cards have the same rank, this will be implemented in the future
    const split = (hand) => {
        if (hand[0].rank === hand[1].rank) {
            return [[{ ...hand[0] }], [{ ...hand[1] }]]
        }
        return null
    }

    //Dealer logic
    const dealerPlay = (deck, dealerHand) => {
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand = [...dealerHand, deck[0]]
            deck.shift()
        }
        return dealerHand
    }

    //The function determinate the winner based on the hand values of the player and the dealer
    const determinateWinner = (playerHandValue, dealerHandValue) => {
        if (playerHandValue > 21) return "dealer"
        if (dealerHandValue > 21) return "player"
        if (playerHandValue > dealerHandValue) return "player"
        if (playerHandValue < dealerHandValue) return "dealer"
        return "tie"
    }

    const hideDealerCard = (dealerHand, game) => {
        const DEALER_HAND = 0
        const responseGame = structuredClone(game)

        if (responseGame.status !== "finished") {
            const dealer = responseGame.dealer[DEALER_HAND]
            dealer.hand[1] = { rank: "hidden", suit: "hidden" }
            dealer.value = calculateHandValue([dealer.hand[0]])
        }

        return responseGame
    }

    const setHand = (hand) => {
        const responseHand = structuredClone(hand)

        responseHand.value = calculateHandValue(hand.hand)
        responseHand.bust = responseHand.value > 21
        responseHand.blackjack = responseHand.value === 21
        if (responseHand.bust || responseHand.blackjack) {
            responseHand.resolved = true
        }
        if (responseHand.doubled) {
            responseHand.resolved = true
        }

        return responseHand
    }

    const getPayout = (game, handNumber, natural) => {
        if (natural && game.player[handNumber].blackjack) return { payout: game.player[handNumber].bet * 1.5 + game.player[handNumber].bet, type: "WIN" }
        if  (game.player[handNumber].resolved && game.player[handNumber].doubled && game.status === "finished" && game.winners[handNumber] === "player") return { payout: game.player[handNumber].bet * 2, type: "WIN" }
        if (game.player[handNumber].resolved && !game.player[handNumber].doubled && game.status === "finished" && game.winners[handNumber] === "player") return { payout: game.player[handNumber].bet * 2, type: "WIN" }
        if (game.winners[handNumber] === "tie") return { payout: game.player[handNumber].bet, type: "REFUND" }
        return { payout: 0, type: "LOSE" }
    }

    return {
        createDeck,
        shuffleDeck,
        calculateHandValue,
        getInitialHand,
        hit,
        double,
        split,
        dealerPlay,
        determinateWinner,
        hideDealerCard,
        setHand,
        getPayout,
    }
}

export default createBlackJack
