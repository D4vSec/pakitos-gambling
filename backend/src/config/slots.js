export const SYMBOLS = [
	{ name: "cherry", weight: 30, payout: 2 },
	{ name: "lemon", weight: 25, payout: 3 },
	{ name: "orange", weight: 20, payout: 4 },
	{ name: "plum", weight: 15, payout: 5 },
	{ name: "bell", weight: 6, payout: 10 },
	{ name: "bar", weight: 3, payout: 20 },
	{ name: "seven", weight: 1, payout: 50 },
]

// Supported machine types: rows x cols
export const MACHINE_TYPES = {
	"3x3": { rows: 3, cols: 3 },
	"3x5": { rows: 3, cols: 5 },
	"5x5": { rows: 5, cols: 5 },
}


export const generatePaylines = (rows, cols) => {
	const paylines = []

	for (let r = 0; r < rows; r++) {
		paylines.push({
			id: `H_ROW${r}`,
			positions: Array.from({ length: cols }, (_, c) => [r, c]),
		})
	}

	for (let c = 0; c < cols; c++) {
		paylines.push({
			id: `V_COL${c}`,
			positions: Array.from({ length: rows }, (_, r) => [r, c]),
		})
	}

	if (rows === cols) {
		paylines.push({
			id: "D_MAIN",
			positions: Array.from({ length: rows }, (_, i) => [i, i]),
		})

		paylines.push({
			id: "D_ANTI",
			positions: Array.from({ length: rows }, (_, i) => [i, cols - 1 - i]),
		})
	}

	if (cols >= 3) {
		const midRow = Math.floor(rows / 2)
		const midCol = Math.floor(cols / 2)

		const vShape = []
		for (let c = 0; c < cols; c++) {
			const r =
				c <= midCol
					? Math.round((midRow / midCol) * c)
					: Math.round(midRow - (midRow / midCol) * (c - midCol))
			vShape.push([Math.min(r, rows - 1), c])
		}
		paylines.push({ id: "D_V", positions: vShape })

		const lambdaShape = vShape.map(([r, c]) => [rows - 1 - r, c])
		paylines.push({ id: "D_LAMBDA", positions: lambdaShape })
	}

	if (rows >= 3 && cols >= 3) {
		const midCol = Math.floor(cols / 2)

		const zigTop = Array.from({ length: cols }, (_, c) => [c === midCol ? 1 : 0, c])
		paylines.push({ id: "Z_TOP", positions: zigTop })

		const zigBot = Array.from({ length: cols }, (_, c) => [
			c === midCol ? rows - 2 : rows - 1,
			c,
		])
		paylines.push({ id: "Z_BOT", positions: zigBot })
	}

	return paylines
}
