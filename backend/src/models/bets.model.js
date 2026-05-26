import db from "#config/db.config"
import {
    getFilterGroups,
    getSortClause,
    isValidUuid,
    normalizeList,
    pushContainsClause,
} from "#utils/admin-query.utils"

const BET_STATUSES = Object.freeze(["open", "closed"])
const BET_SELECTABLE_COLUMNS = Object.freeze({
    name: "bets.label",
    label: "bets.label",
    status: "status",
    endsAt: "bets.ends_at",
    ends_at: "bets.ends_at",
    createdAt: "bets.created_at",
    created_at: "bets.created_at",
})

const applyBetFilter = (field, rawValues, clauses, values) => {
    const normalizedValues = normalizeList(rawValues)
    if (normalizedValues.length === 0) return false

    switch (field) {
        case "name":
        case "label":
            pushContainsClause(clauses, values, "bets.label", normalizedValues)
            return false
        case "status": {
            const normalizedStatuses = [...new Set(normalizedValues.map((value) => String(value).trim().toLowerCase()))]
            const validStatuses = normalizedStatuses.filter((value) => BET_STATUSES.includes(value))
            if (validStatuses.length === 0) return true
            if (validStatuses.length === BET_STATUSES.length) return false

            const statusClauses = []
            if (validStatuses.includes("open")) statusClauses.push("bets.ends_at >= CURRENT_TIMESTAMP")
            if (validStatuses.includes("closed")) statusClauses.push("bets.ends_at < CURRENT_TIMESTAMP")

            clauses.push(`(${statusClauses.join(" OR ")})`)
            return false
        }
        default:
            return false
    }
}

const buildBetFilters = (rawFilters = {}) => {
    const clauses = []
    const values = []
    let impossible = false

    if (rawFilters.name) impossible = applyBetFilter("name", rawFilters.name, clauses, values) || impossible
    if (rawFilters.label) impossible = applyBetFilter("label", rawFilters.label, clauses, values) || impossible
    if (rawFilters.status) impossible = applyBetFilter("status", rawFilters.status, clauses, values) || impossible

    for (const filter of getFilterGroups(rawFilters)) {
        impossible = applyBetFilter(filter.field, filter.values, clauses, values) || impossible
    }

    if (impossible) return { where: "WHERE 1 = 0", values: [] }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : ""
    return { where, values }
}

const buildBetSelectQuery = ({ where = "", orderBy = "ORDER BY bets.ends_at ASC", limit, offset, baseValueCount = 0 }) => {
    let query = `SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id ${where} GROUP BY bets.id ${orderBy}`
    const values = []

    if (limit !== undefined) {
        values.push(limit)
        query += ` LIMIT $${baseValueCount + values.length}`
    }

    if (offset !== undefined) {
        values.push(offset)
        query += ` OFFSET $${baseValueCount + values.length}`
    }

    return { query, values }
}

const getUserBetSelections = async (user_id, betIds = []) => {
    if (!isValidUuid(String(user_id))) return []

    const validBetIds = [...new Set(betIds.filter((betId) => isValidUuid(String(betId))))]
    if (validBetIds.length === 0) return []

    const result = await db.query(
        `
        SELECT
            ub.id,
            ub.amount,
            ub.bet_option_id,
            bo.bet_id,
            bo.label AS option_label,
            bo.odd
        FROM user_bets ub
        INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
        WHERE ub.user_id = $1 AND bo.bet_id = ANY($2::uuid[])
    `,
        [user_id, validBetIds],
    )

    return result.rows
}

const normalizeSettlementWinners = (winners = []) => winners.map((winner) => ({
    ...winner,
    amount: Number(Number(winner.amount || 0).toFixed(2)),
    payout: Number(Number(winner.payout || 0).toFixed(2)),
}))

const buildSettlementSummary = ({ winningOption, winners = [], poolDistribution = [], settledAt = null, settledByUserId = null }) => {
    const normalizedWinners = normalizeSettlementWinners(winners)
    const totalPool = poolDistribution.reduce(
        (sum, option) => sum + Number(option.amount || 0),
        0,
    )
    const totalWinningAmount = normalizedWinners.reduce(
        (sum, winner) => sum + Number(winner.amount || 0),
        0,
    )
    const totalProjectedPayout = normalizedWinners.reduce(
        (sum, winner) => sum + Number(winner.payout || 0),
        0,
    )

    return {
        winningOption,
        totalPool: Number(totalPool.toFixed(2)),
        totalWinningAmount: Number(totalWinningAmount.toFixed(2)),
        totalProjectedPayout: Number(totalProjectedPayout.toFixed(2)),
        winners: normalizedWinners,
        settledAt,
        settledByUserId,
    }
}

const parseAuditDetails = (details) => {
    if (!details) return null

    if (typeof details === "string") {
        try {
            return JSON.parse(details)
        } catch {
            return null
        }
    }

    return typeof details === "object" ? details : null
}

const insertBet = async (executor, bet) => {
    const { label, ends_at } = bet
    const result = await executor.query(
        "INSERT INTO bets (label, ends_at) VALUES ($1, $2) RETURNING *",
        [label, ends_at],
    )

    return result.rows[0]
}

const insertBetOption = async (executor, betOption) => {
    const { bet_id, label, odd } = betOption
    const result = await executor.query(
        "INSERT INTO bets_options (bet_id, label, odd) VALUES ($1, $2, $3) RETURNING *",
        [bet_id, label, odd],
    )

    return result.rows[0]
}

const getPoolDistributionByExecutor = async (executor, bet_id) => {
    const result = await executor.query(
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

const getSettlementPreviewByExecutor = async (executor, bet_id, winning_option_id) => {
    const winningOptionResult = await executor.query(
        "SELECT id, bet_id, label, odd FROM bets_options WHERE id = $1 AND bet_id = $2",
        [winning_option_id, bet_id],
    )

    const winningOption = winningOptionResult.rows[0]
    if (!winningOption) return null

    const winnersResult = await executor.query(
        `
        SELECT
            ub.user_id,
            COALESCE(SUM(ub.amount), 0) AS amount,
            COALESCE(SUM(ub.amount * bo.odd), 0) AS payout
        FROM user_bets ub
        INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
        WHERE bo.bet_id = $1 AND bo.id = $2
        GROUP BY ub.user_id
        ORDER BY payout DESC, ub.user_id ASC
    `,
        [bet_id, winning_option_id],
    )

    return {
        winningOption,
        winners: winnersResult.rows,
    }
}

const getSettlementAuditByExecutor = async (executor, bet_id) => {
    const result = await executor.query(
        `
        SELECT user_id, details, created_at
        FROM audit_logs
        WHERE action = 'BET_RESULT' AND details::jsonb ->> 'betId' = $1
        ORDER BY created_at DESC
        LIMIT 1
    `,
        [bet_id],
    )

    const row = result.rows[0]
    if (!row) return null

    const details = parseAuditDetails(row.details)
    if (!details || details.type !== "BET_SETTLED") return null

    return {
        ...details,
        winners: normalizeSettlementWinners(details.winners),
        totalPool: Number(Number(details.totalPool || 0).toFixed(2)),
        totalWinningAmount: Number(Number(details.totalWinningAmount || 0).toFixed(2)),
        totalProjectedPayout: Number(Number(details.totalProjectedPayout || 0).toFixed(2)),
        settledAt: details.settledAt ?? row.created_at,
        settledByUserId: details.settledByAdminId ?? row.user_id,
    }
}

const createBet = async (bet) => {
    return insertBet(db, bet)
}

const createBetOption = async (betOption) => {
    return insertBetOption(db, betOption)
}

const placeBet = async (user_id, bet_option_id, amount, executor = db) => {
    const result = await executor.query(
        "INSERT INTO user_bets (user_id, bet_option_id, amount) VALUES ($1, $2, $3) RETURNING *",
        [user_id, bet_option_id, amount],
    )
    return result.rows[0]
}

const placeBetForUser = async (user_id, bet_id, bet_option_id, amount) => {
    if (!isValidUuid(String(user_id)) || !isValidUuid(String(bet_id)) || !isValidUuid(String(bet_option_id))) {
        return { code: "OPTION_NOT_FOUND" }
    }

    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return { code: "INVALID_BET_AMOUNT" }
    }

    const client = await db.getClient()

    const rollbackWith = async (payload) => {
        await client.query("ROLLBACK")
        return payload
    }

    try {
        await client.query("BEGIN")

        const userResult = await client.query(
            "SELECT balance FROM users WHERE id = $1 FOR UPDATE",
            [user_id],
        )
        const user = userResult.rows[0]
        if (!user) return rollbackWith({ code: "USER_NOT_FOUND" })

        const betResult = await client.query(
            "SELECT id, label, ends_at FROM bets WHERE id = $1 FOR UPDATE",
            [bet_id],
        )
        const bet = betResult.rows[0]
        if (!bet) return rollbackWith({ code: "BET_NOT_FOUND" })

        if (new Date(bet.ends_at) < new Date()) {
            return rollbackWith({ code: "BET_CLOSED" })
        }

        const optionResult = await client.query(
            "SELECT id, bet_id, label, odd FROM bets_options WHERE id = $1 AND bet_id = $2 FOR UPDATE",
            [bet_option_id, bet_id],
        )
        const option = optionResult.rows[0]
        if (!option) return rollbackWith({ code: "OPTION_NOT_FOUND" })

        const existingBetResult = await client.query(
            `
            SELECT ub.id, ub.bet_option_id, bo.label AS option_label
            FROM user_bets ub
            INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
            WHERE ub.user_id = $1 AND bo.bet_id = $2
            LIMIT 1
        `,
            [user_id, bet_id],
        )
        const existingBet = existingBetResult.rows[0]
        if (existingBet) {
            return rollbackWith({
                code: "BET_ALREADY_PLACED_ON_MARKET",
                existingBetId: existingBet.id,
                existingBetOptionId: existingBet.bet_option_id,
                existingOptionLabel: existingBet.option_label,
            })
        }

        if (Number(user.balance) < numericAmount) {
            return rollbackWith({ code: "INSUFFICIENT_FUNDS" })
        }

        const balanceResult = await client.query(
            `WITH upd AS (
                UPDATE users
                SET balance = balance - $1
                WHERE id = $2 AND balance >= $1
                RETURNING balance
            ), ins AS (
                INSERT INTO transactions (user_id, amount, type)
                SELECT $2, $1, 'BET'::transaction_type
                WHERE EXISTS (SELECT 1 FROM upd)
                RETURNING id
            )
            SELECT balance FROM upd`,
            [numericAmount, user_id],
        )
        const updatedBalance = balanceResult.rows[0]?.balance
        if (updatedBalance === undefined) {
            return rollbackWith({ code: "INSUFFICIENT_FUNDS" })
        }

        const placedBet = await placeBet(user_id, bet_option_id, numericAmount, client)

        await client.query("COMMIT")

        return {
            ...placedBet,
            bet_id,
            bet_label: bet.label,
            option_label: option.label,
            odd: option.odd,
            balance: updatedBalance,
        }
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

const countBets = async (filters = {}) => {
    const { where, values } = buildBetFilters(filters)
    const result = await db.query(
        `SELECT COUNT(*)::int AS count FROM bets ${where}`,
        values,
    )

    return result.rows[0]?.count ?? 0
}

const findBets = async (page = 1, limit = 20, filters = {}) => {
    if (limit > 100) limit = 100
    if (page < 1) page = 1

    const offset = (page - 1) * limit
    const orderBy = getSortClause({
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        allowedColumns: BET_SELECTABLE_COLUMNS,
        defaultSort: "ORDER BY bets.ends_at ASC",
    })
    const { where, values } = buildBetFilters(filters)
    const { query, values: paginationValues } = buildBetSelectQuery({
        where,
        orderBy,
        limit,
        offset,
        baseValueCount: values.length,
    })
    const result = await db.query(
        query,
        [...values, ...paginationValues],
    )

    return result.rows
}

const getBets = async (filters = {}) => findBets(1, 20, filters)

const getBetById = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return null

    const result = await db.query(
        "SELECT *, CASE WHEN ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status FROM bets WHERE id = $1",
        [bet_id],
    )
    return result.rows[0]
}

const getBetInfo = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return []

    const result = await db.query(
        "SELECT * FROM bets_options WHERE bet_id = $1 ORDER BY odd DESC, label ASC",
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
    return getPoolDistributionByExecutor(db, bet_id)
}

const hasBetActivity = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return false

    const result = await db.query(
        `
        SELECT EXISTS (
            SELECT 1
            FROM user_bets ub
            INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
            WHERE bo.bet_id = $1
        ) AS has_activity
    `,
        [bet_id],
    )

    return result.rows[0]?.has_activity ?? false
}

const createBetWithOptions = async ({ label, ends_at, options = [] }) => {
    const client = await db.getClient()

    try {
        await client.query("BEGIN")
        const bet = await insertBet(client, { label, ends_at })
        const createdOptions = []

        for (const option of options) {
            createdOptions.push(await insertBetOption(client, {
                bet_id: bet.id,
                label: option.label,
                odd: option.odd,
            }))
        }

        await client.query("COMMIT")
        return { ...bet, options: createdOptions }
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

const updateBet = async (bet_id, updates = {}) => {
    if (!isValidUuid(String(bet_id))) return null

    const client = await db.getClient()

    try {
        await client.query("BEGIN")

        const setClauses = []
        const values = []

        if (updates.label !== undefined) {
            values.push(updates.label)
            setClauses.push(`label = $${values.length}`)
        }

        if (updates.ends_at !== undefined) {
            values.push(updates.ends_at)
            setClauses.push(`ends_at = $${values.length}`)
        }

        let updatedBet
        if (setClauses.length > 0) {
            values.push(bet_id)
            const result = await client.query(
                `UPDATE bets SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
                values,
            )
            updatedBet = result.rows[0]
        } else {
            const result = await client.query("SELECT * FROM bets WHERE id = $1", [bet_id])
            updatedBet = result.rows[0]
        }

        if (!updatedBet) {
            await client.query("ROLLBACK")
            return null
        }

        if (Array.isArray(updates.options)) {
            await client.query("DELETE FROM bets_options WHERE bet_id = $1", [bet_id])

            for (const option of updates.options) {
                await insertBetOption(client, {
                    bet_id,
                    label: option.label,
                    odd: option.odd,
                })
            }
        }

        await client.query("COMMIT")
        return updatedBet
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

const closeBet = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return null

    const result = await db.query(
        "UPDATE bets SET ends_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
        [bet_id],
    )

    return result.rows[0] || null
}

const deleteBet = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return false

    const client = await db.getClient()

    try {
        await client.query("BEGIN")
        await client.query("DELETE FROM bets_options WHERE bet_id = $1", [bet_id])
        const result = await client.query("DELETE FROM bets WHERE id = $1", [bet_id])
        await client.query("COMMIT")

        return result.rowCount > 0
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

const getSettlementPreview = async (bet_id, winning_option_id) => {
    if (!isValidUuid(String(bet_id)) || !isValidUuid(String(winning_option_id))) {
        return null
    }

    return getSettlementPreviewByExecutor(db, bet_id, winning_option_id)
}

const getBetSettlement = async (bet_id) => {
    if (!isValidUuid(String(bet_id))) return null

    return getSettlementAuditByExecutor(db, bet_id)
}

const settleBet = async (bet_id, winning_option_id, metadata = {}) => {
    if (!isValidUuid(String(bet_id))) return { code: "BET_NOT_FOUND" }
    if (!isValidUuid(String(winning_option_id))) return { code: "OPTION_NOT_FOUND" }
    if (!isValidUuid(String(metadata.adminUserId))) return { code: "INVALID_SETTLEMENT_ADMIN" }

    const client = await db.getClient()

    try {
        await client.query("BEGIN")

        const betResult = await client.query(
            "SELECT *, CASE WHEN ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status FROM bets WHERE id = $1 FOR UPDATE",
            [bet_id],
        )
        const bet = betResult.rows[0]
        if (!bet) {
            await client.query("ROLLBACK")
            return { code: "BET_NOT_FOUND" }
        }

        const existingSettlement = await getSettlementAuditByExecutor(client, bet_id)
        if (existingSettlement) {
            await client.query("ROLLBACK")
            return { code: "BET_ALREADY_SETTLED", settlement: existingSettlement }
        }

        const settlementPreview = await getSettlementPreviewByExecutor(client, bet_id, winning_option_id)
        if (!settlementPreview) {
            await client.query("ROLLBACK")
            return { code: "OPTION_NOT_FOUND" }
        }

        const poolDistribution = await getPoolDistributionByExecutor(client, bet_id)
        const settlementSummary = buildSettlementSummary({
            winningOption: settlementPreview.winningOption,
            winners: settlementPreview.winners,
            poolDistribution,
            settledByUserId: metadata.adminUserId,
        })

        for (const winner of settlementSummary.winners) {
            if (winner.payout <= 0) continue

            await client.query(
                `
                WITH upd AS (
                    UPDATE users
                    SET balance = balance + $1
                    WHERE id = $2
                    RETURNING balance
                ), ins AS (
                    INSERT INTO transactions (user_id, amount, type)
                    SELECT $2, $1, 'WIN'::transaction_type
                    WHERE EXISTS (SELECT 1 FROM upd)
                    RETURNING id
                )
                SELECT balance FROM upd;
            `,
                [winner.payout, winner.user_id],
            )
        }

        const closedBetResult = await client.query(
            "UPDATE bets SET ends_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *, CASE WHEN ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status",
            [bet_id],
        )
        const settledAt = new Date().toISOString()
        const closedBet = closedBetResult.rows[0] || { ...bet, ends_at: settledAt, status: "closed" }

        await client.query(
            "INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)",
            [
                metadata.adminUserId,
                "BET_RESULT",
                {
                    type: "BET_SETTLED",
                    betId: bet_id,
                    winningOption: settlementSummary.winningOption,
                    totalPool: settlementSummary.totalPool,
                    totalWinningAmount: settlementSummary.totalWinningAmount,
                    totalProjectedPayout: settlementSummary.totalProjectedPayout,
                    winners: settlementSummary.winners,
                    winnersCount: settlementSummary.winners.length,
                    settledByAdminId: metadata.adminUserId,
                    settledAt,
                },
                metadata.ipAddress ?? null,
                metadata.userAgent ?? null,
            ],
        )

        await client.query("COMMIT")

        return {
            bet: { ...closedBet, status: "closed" },
            poolDistribution,
            ...settlementSummary,
            settledAt,
        }
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

export default {
    buildSettlementSummary,
    closeBet,
    countBets,
    createBet,
    createBetOption,
    createBetWithOptions,
    deleteBet,
    findBets,
    getUserBetSelections,
    placeBet,
    placeBetForUser,
    getBets,
    getBetById,
    getBetSettlement,
    getBetInfo,
    getPoolDistribution,
    getOptionsByOptionId,
    getSettlementPreview,
    hasBetActivity,
    settleBet,
    updateBet,
    updateOptionOdd,
}
