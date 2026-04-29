export const TRANSACTION_TYPES = Object.freeze([
	"DEPOSIT",
	"WITHDRAWAL",
	"BET",
	"WIN",
	"LOSE",
	"BONUS",
	"REFUND",
])

export const CREDIT_TRANSACTION_TYPES = new Set([
	"DEPOSIT",
	"WIN",
	"BONUS",
	"REFUND",
])

export const DEBIT_TRANSACTION_TYPES = new Set([
	"WITHDRAWAL",
	"BET",
	"LOSE",
])

export const getDefaultTransactionType = (amount) =>
	Number(amount) >= 0 ? "DEPOSIT" : "WITHDRAWAL"

export const isTransactionType = (type) => TRANSACTION_TYPES.includes(type)

export const getSignedTransactionAmount = (type, amount) => {
	const numericAmount = Number(amount)

	if (!Number.isFinite(numericAmount) || numericAmount <= 0) return null
	if (!isTransactionType(type)) return null

	if (CREDIT_TRANSACTION_TYPES.has(type)) return numericAmount
	if (DEBIT_TRANSACTION_TYPES.has(type)) return -numericAmount

	return null
}
