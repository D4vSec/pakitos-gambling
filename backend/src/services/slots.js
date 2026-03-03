import { randomInt } from "#utils/rng"
import { SYMBOLS, MACHINE_TYPES, generatePaylines } from "#config/slots"

const createSlots = (machineType = "3x5") => {
	if (!MACHINE_TYPES[machineType]) {
		throw new Error(
			`Unknown machine type "${machineType}". Valid types: ${Object.keys(MACHINE_TYPES).join(", ")}`,
		)
	}

	const { rows: ROWS, cols: COLS } = MACHINE_TYPES[machineType]
	const PAYLINES = generatePaylines(ROWS, COLS)

	const symbolPool = SYMBOLS.flatMap((symbol) => Array(symbol.weight).fill(symbol.name))

	const spinReel = () => symbolPool[randomInt(0, symbolPool.length)]

	const spinGrid = () =>
		Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => spinReel()))

	const getLineSymbols = (grid, payline) => payline.positions.map(([row, col]) => grid[row][col])

	const evaluateLine = (grid, payline) => {
		const symbols = getLineSymbols(grid, payline)
		const first = symbols[0]
		let consecutive = 1

		for (let i = 1; i < symbols.length; i++) {
			if (symbols[i] === first) consecutive++
			else break
		}

		if (consecutive < 3) return null

		const symbolData = SYMBOLS.find((s) => s.name === first)
		const consecutiveBonus = consecutive - 2

		const isWinner = consecutive >= 3

		return {
			paylineId: payline.id,
			symbol: first,
			consecutive,
			basePayout: symbolData.payout,
			multiplier: symbolData.payout * consecutiveBonus,
			isWinner,
		}
	}

	const evaluateGrid = (grid) => {
		const winningLines = []

		for (const payline of PAYLINES) {
			const result = evaluateLine(grid, payline)
			if (result) winningLines.push(result)
		}

		return winningLines
	}

	const calculatePayout = (winningLines, bet) => {
		if (winningLines.length === 0) return 0

		const totalMultiplier = winningLines.reduce((acc, line) => acc + line.multiplier, 0)

		return Math.floor(bet * totalMultiplier)
	}

	const spin = (bet) => {
		const grid = spinGrid()
		const winningLines = evaluateGrid(grid)
		const payout = calculatePayout(winningLines, bet)
		const isWinner = winningLines.length > 0

		return {
			machineType,
			rows: ROWS,
			cols: COLS,
			grid,
			winningLines,
			payout,
			isWinner,
		}
	}

	return {
		machineType,
		ROWS,
		COLS,
		SYMBOLS,
		PAYLINES,
		spinReel,
		spinGrid,
		getLineSymbols,
		evaluateLine,
		evaluateGrid,
		calculatePayout,
		spin,
	}
}

export default createSlots
