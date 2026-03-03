import { randomInt } from "#utils/rng"

//This factory contains all the necessary functions to manage the logic of the BlackJack
const createBlackJack = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
    const cards = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ]

    const createDeck = () => {
        let deck = []
        for (let suit of suits) {
            for (let card of cards) {
                deck.push({ rank: card, suit: suit })
            }
        }
        return deck
    }

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
            }
            if (["J", "Q", "K"].includes(card.rank)) value += 10
            value = parseInt(card.rank)
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

    const split = (hand, splitHand) => {
        if (hand[0].rank === hand[1].rank) splitHand = true
        return [[hand[0]], [hand[1]]]
    }

    //Dealer logic
    const dealerPlay = (deck, dealerHand, playerHand) => {
        if (calculateHandValue(playerHand) < calculateHandValue(dealerHand))
            return dealerHand
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand = [...dealerHand, deck[0]]
            deck.shift()
        }
        return dealerHand
    }

    const determinateWinner = (playerHandValue, dealerHandValue) => {
        if (playerHandValue > 21) return "Dealer"
        if (dealerHandValue > 21) return "Player"
        if (playerHandValue > dealerHandValue) return "Player"
        if (playerHandValue < dealerHandValue) return "Dealer"
        return "Tie"
    }

    return {
        createDeck,
        shuffleDeck,
        calculateHandValue,
        getInitialHand,
        hit,
        stand,
        double,
        split,
        surrender,
        dealerPlay,
        determinateWinner,
    }
}

export default createBlackJack
