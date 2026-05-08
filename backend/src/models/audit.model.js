import db from "#config/db.config"

const logAction = async (user_id, action, details, ip_address, user_agent) => {
    await db.query(
        "INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)",
        [user_id, action, details, ip_address, user_agent],
    )
}

const buildAuditFilters = (filters = {}) => {
    const clauses = []
    const values = []

    if (filters.userId) {
        values.push(filters.userId)
        clauses.push(`user_id = $${values.length}`)
    }

    if (filters.action) {
        values.push(filters.action)
        clauses.push(`action = $${values.length}`)
    }

    if (filters.fromDate) {
        values.push(filters.fromDate)
        clauses.push(`created_at >= $${values.length}`)
    }

    if (filters.toDate) {
        values.push(filters.toDate)
        clauses.push(`created_at <= $${values.length}`)
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""

    return { where, values }
}

const countAuditLogs = async (filters = {}) => {
    const { where, values } = buildAuditFilters(filters)
    const result = await db.query(`SELECT COUNT(*)::int AS count FROM audit_logs ${where}`, values)
    return result.rows[0]?.count ?? 0
}

const getAuditLogs = async (page = 1, limit = 20, filters = {}) => {
    if (limit > 100) limit = 100
    if (page < 1) page = 1

    const offset = (page - 1) * limit
    const { where, values } = buildAuditFilters(filters)
    const result = await db.query(
        `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, offset],
    )
    return result.rows
}

export default {
    logAction,
    getAuditLogs,
    countAuditLogs,
}
