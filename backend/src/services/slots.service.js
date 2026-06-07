import { randomInt } from "#utils/rng.utils"
import { SYMBOLS, MACHINE_TYPES, PATTERN_BOOST, generatePaylines } from "#config/slots.config"

const createSlots = (machineType = "3x5") => {
	if (!MACHINE_TYPES[machineType]) {
		throw new Error(
			`Unknown machine type "${machineType}". Valid types: ${Object.keys(MACHINE_TYPES).join(", ")}`,
		)
	}

	const { rows: ROWS, cols: COLS, minConsecutive: MIN_CONSECUTIVE } = MACHINE_TYPES[machineType]
	const PAYLINES = generatePaylines(ROWS, COLS)
	const MAX_FORCED_LINES = PATTERN_BOOST.maxForcedLinesByType[machineType] ?? 0
	const COMPLETION_CHANCE_BY_MISSING =
		PATTERN_BOOST.completionChanceByMissingByType[machineType] ?? {}

	const symbolPool = SYMBOLS.flatMap((symbol) =>
		Array(Math.round(symbol.weight)).fill(symbol.name),
	)

	const spinReel = (exclude = null) => {
		let symbol
		do {
			symbol = symbolPool[randomInt(0, symbolPool.length)]
		} while (symbol === exclude)
		return symbol
	}

	const spinGrid = () => {
		const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null))

		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS; r++) {
				const above = r > 0 ? grid[r - 1][c] : null
				grid[r][c] = spinReel(above)
			}
		}

		return grid
	}

	const getLineSymbols = (grid, payline) => payline.positions.map(([row, col]) => grid[row][col])

	const getLeadingMatch = (grid, payline) => {
		const symbols = getLineSymbols(grid, payline)
		const first = symbols[0]
		let consecutive = 1

		for (let i = 1; i < symbols.length; i++) {
			if (symbols[i] === first) consecutive++
			else break
		}

		return {
			symbols,
			first,
			consecutive,
			missing: Math.max(0, MIN_CONSECUTIVE - consecutive),
		}
	}

	const evaluateLine = (grid, payline) => {
		const { first, consecutive } = getLeadingMatch(grid, payline)

		if (consecutive < MIN_CONSECUTIVE) return null

		const symbolData = SYMBOLS.find((s) => s.name === first)
		// Scale: 0 extra → ×1, 1 extra → ×2, 2 extra → ×3
		const consecutiveScale = 1 + (consecutive - MIN_CONSECUTIVE)

		return {
			paylineId: payline.id,
			symbol: first,
			consecutive,
			basePayout: symbolData.payout,
			consecutiveScale,
			lineMultiplier: symbolData.payout * consecutiveScale,
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

	const HOUSE_EDGE = 0.05

	const calculatePayout = (winningLines, bet) => {
		if (winningLines.length === 0) return 0

		const total = winningLines.reduce((acc, line) => acc + bet * line.lineMultiplier, 0)

		const maxPayout = bet * 500
		const afterEdge = total * (1 - HOUSE_EDGE)

		return Math.max(1, Math.floor(Math.min(afterEdge, maxPayout)))
	}

	const maybeBoostWinningPatterns = (grid) => {
		if (MAX_FORCED_LINES <= 0) return grid

		const boostedGrid = grid.map((row) => [...row])
		let forcedLines = 0

		while (forcedLines < MAX_FORCED_LINES) {
			const candidates = PAYLINES
				.map((payline) => {
					const { first, consecutive, missing } = getLeadingMatch(boostedGrid, payline)

					return {
						payline,
						symbol: first,
						consecutive,
						missing,
						chance: COMPLETION_CHANCE_BY_MISSING[missing] ?? 0,
					}
				})
				.filter(
					(candidate) =>
						candidate.consecutive < MIN_CONSECUTIVE &&
						candidate.missing > 0 &&
						candidate.chance > 0,
				)
				.sort((a, b) => a.missing - b.missing || b.consecutive - a.consecutive)

			if (candidates.length === 0) break

			let boostedAnyLine = false

			for (const candidate of candidates) {
				if (randomInt(0, 100) >= candidate.chance) continue

				for (let i = candidate.consecutive; i < candidate.payline.positions.length; i++) {
					const [row, col] = candidate.payline.positions[i]
					boostedGrid[row][col] = candidate.symbol
				}

				forcedLines++
				boostedAnyLine = true
				break
			}

			if (!boostedAnyLine) break
		}

		return boostedGrid
	}

	const spin = (bet) => {
		const grid = maybeBoostWinningPatterns(spinGrid())
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
		getLeadingMatch,
		evaluateLine,
		evaluateGrid,
		maybeBoostWinningPatterns,
		calculatePayout,
		spin,
	}
}

export default createSlots
