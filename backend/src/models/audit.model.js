import db from "#config/db.config"
import { AUDIT_DEFAULT_COLUMNS, AUDIT_SELECTABLE_COLUMNS } from "#config/admin-filters.config"
import {
	getFilterGroups,
	getSelectedColumns,
	getSortClause,
	isValidUuid,
	normalizeDate,
	normalizeList,
	pushContainsClause,
	pushInClause,
} from "#utils/admin-query.utils"

const logAction = async (user_id, action, details, ip_address, user_agent) => {
	await db.query(
		"INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)",
		[user_id, action, details, ip_address, user_agent],
	)
}

const applyAuditFilter = (field, rawValues, clauses, values) => {
	const normalizedValues = normalizeList(rawValues)
	if (normalizedValues.length === 0) return false

	switch (field) {
		case "id":
		case "userId":
		case "user_id": {
			const validValues = normalizedValues.filter(isValidUuid)
			if (validValues.length === 0) return true

			const column = field === "id" ? "id" : "user_id"
			pushInClause(clauses, values, column, validValues)
			return false
		}
		case "action":
			pushInClause(clauses, values, "action", normalizedValues)
			return false
		case "ip":
		case "ipAddress":
		case "ip_address":
			pushContainsClause(clauses, values, "host(ip_address)", normalizedValues)
			return false
		case "userAgent":
		case "user_agent":
			pushContainsClause(clauses, values, "user_agent", normalizedValues)
			return false
		case "details":
			pushContainsClause(clauses, values, "details::text", normalizedValues)
			return false
		case "createdAt":
		case "created_at":
			pushInClause(clauses, values, "created_at", normalizedValues)
			return false
		default:
			return false
	}
}

const buildAuditFilters = (rawFilters = {}) => {
	const clauses = []
	const values = []
	let impossible = false

	if (rawFilters.userId) impossible = applyAuditFilter("userId", rawFilters.userId, clauses, values) || impossible
	if (rawFilters.action) impossible = applyAuditFilter("action", rawFilters.action, clauses, values) || impossible
	if (rawFilters.id) impossible = applyAuditFilter("id", rawFilters.id, clauses, values) || impossible
	if (rawFilters.ipAddress) impossible = applyAuditFilter("ipAddress", rawFilters.ipAddress, clauses, values) || impossible
	if (rawFilters.ip_address) impossible = applyAuditFilter("ip_address", rawFilters.ip_address, clauses, values) || impossible
	if (rawFilters.userAgent) impossible = applyAuditFilter("userAgent", rawFilters.userAgent, clauses, values) || impossible
	if (rawFilters.user_agent) impossible = applyAuditFilter("user_agent", rawFilters.user_agent, clauses, values) || impossible
	if (rawFilters.details) impossible = applyAuditFilter("details", rawFilters.details, clauses, values) || impossible

	const fromDate = normalizeDate(rawFilters.fromDate, "start")
	if (fromDate) {
		values.push(fromDate)
		clauses.push(`created_at >= $${values.length}`)
	}

	const toDate = normalizeDate(rawFilters.toDate, "end")
	if (toDate) {
		values.push(toDate)
		clauses.push(`created_at <= $${values.length}`)
	}

	for (const filter of getFilterGroups(rawFilters)) {
		impossible = applyAuditFilter(filter.field, filter.values, clauses, values) || impossible
	}

	if (impossible) return { where: "WHERE 1 = 0", values: [] }

	const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : ""
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
	const selectColumns = filters.columns
		? getSelectedColumns(filters.columns, AUDIT_SELECTABLE_COLUMNS, AUDIT_DEFAULT_COLUMNS).join(", ")
		: "*"
	const orderBy = getSortClause({
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		allowedColumns: AUDIT_SELECTABLE_COLUMNS,
		defaultSort: "ORDER BY created_at DESC",
	})
	const { where, values } = buildAuditFilters(filters)
	const result = await db.query(
		`SELECT ${selectColumns} FROM audit_logs ${where} ${orderBy} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
		[...values, limit, offset],
	)

	return result.rows
}

export default {
	logAction,
	getAuditLogs,
	countAuditLogs,
}
