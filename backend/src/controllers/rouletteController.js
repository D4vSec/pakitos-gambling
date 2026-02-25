const winningNumber = spinRoulette()

if (betKind === "") {
    const isWinner = isTwelveWinner(betValue, winningNumber)
    if (isWinner) {
        payout = betAmount * 3
    }
}