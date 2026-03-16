import db from "#config/db"

const createBet = async (bet) => {
    const { label, ends_at } = bet
    const result = await db.query(
        "INSERT INTO bets (label, ends_at) VALUES ($1, $2) RETURNING *",
        [label, ends_at],
    )
    return result.rows[0]
}

const createBetOption = async (betOption) => {
    const { bet_id, label, odd } = betOption
    const result = await db.query(
        "INSERT INTO bets_options (bet_id, label, odd) VALUES ($1, $2, $3) RETURNING *",
        [bet_id, label, odd],
    )
    return result.rows[0]
}

const placeBet = async (user_id, bet_option_id, amount) => {
    const result = await db.query(
        "INSERT INTO user_bets (user_id, bet_option_id, amount) VALUES ($1, $2, $3) RETURNING *",
        [user_id, bet_option_id, amount],
    )
    return result.rows[0]
}

const getBets = async () => {
    const result = await db.query(`
        SELECT bets.*, 
               json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd)) as options
        FROM bets
        LEFT JOIN bets_options ON bets.id = bets_options.bet_id
        GROUP BY bets.id
    `)
    return result.rows
}

const getBetById = async (bet_id) => {
    const result = await db.query("SELECT * FROM bets WHERE id = $1", [bet_id])
    return result.rows[0]
}

const getBetInfo = async (bet_id) => {
    const result = await db.query(
        "SELECT * FROM bets_options WHERE bet_id = $1",
        [bet_id],
    )
    return result.rows
}

const updateOptionOdd = async (option_id, new_odd) => {
    await db.query("UPDATE bets_options SET odd = $1 WHERE id = $2", [
        new_odd,
        option_id,
    ])
}

const getOptionsByOptionId = async (option_id) => {
    const betRes = await db.query(
        "SELECT bet_id FROM bets_options WHERE id = $1",
        [option_id],
    )
    if (betRes.rows.length === 0) return []
    const betId = betRes.rows[0].bet_id

    const result = await db.query(
        "SELECT * FROM bets_options WHERE bet_id = $1",
        [betId],
    )
    return result.rows
}

const getPoolDistribution = async (bet_id) => {
    const result = await db.query(
        `
        SELECT bo.id, bo.label, COALESCE(SUM(ub.amount), 0) as amount, bo.odd
        FROM bets_options bo
        LEFT JOIN user_bets ub ON bo.id = ub.bet_option_id
        WHERE bo.bet_id = $1
        GROUP BY bo.id
    `,
        [bet_id],
    )
    return result.rows
}

export default {
    createBet,
    createBetOption,
    placeBet,
    getBets,
    getBetInfo,
    updateOptionOdd,
    getPoolDistribution,
    getOptionsByOptionId,
    getBetById,
}
