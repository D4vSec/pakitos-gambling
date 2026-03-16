import db from "#config/db"

const createBet = async (bet) => {
	const { label, ends_at } = bet
	const result = await db.query("INSERT INTO bets (label, ends_at) VALUES ($1, $2) RETURNING *", [
		label,
		ends_at,
	])
	return result.rows[0]
}

const createBetInfo = async (betInfo) => {
	const { bet_id, label, odd } = betInfo
	const result = await db.query(
		"INSERT INTO bets_info (bet_id, label, odd) VALUES ($1, $2, $3) RETURNING *",
		[bet_id, label, odd],
	)
	return result.rows[0]
}

const placeBet = async (user_id, bet_id, amount) => {
	const result = await db.query(
		"INSERT INTO user_bets (user_id, bet_id, amount) VALUES ($1, $2, $3) RETURNING *",
		[user_id, bet_id, amount],
	)
	return result.rows[0]
}

const getBets = async () => {
	const result = await db.query("SELECT * FROM bets")
	return result.rows
}

const getBetInfo = async (bet_id) => {
	const result = await db.query("SELECT * FROM bets_info WHERE bet_id = $1", [bet_id])
	return result.rows
}

export default {
	createBet,
	createBetInfo,
	placeBet,
	getActiveBets,
	getBetInfo,
}
