import db from "#config/db.config"
import {
	TRANSACTION_DEFAULT_COLUMNS,
	TRANSACTION_SELECTABLE_COLUMNS,
	USER_DEFAULT_COLUMNS,
	USER_SELECTABLE_COLUMNS,
} from "#config/admin-filters.config"
import { getDefaultTransactionType, isTransactionType } from "#config/transactions.config"
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
import { hashPassword, comparePassword } from "#utils/password.utils"

const updatableUserColumns = Object.freeze({
	username: "username",
	email: "email",
	password: "password",
	role: "role",
})

const parseNumericValues = (rawValues) =>
	normalizeList(rawValues)
		.map((value) => Number(value))
		.filter((value) => Number.isFinite(value))

const applyUserFilter = (field, rawValues, clauses, values) => {
	const normalizedValues = normalizeList(rawValues)
	if (normalizedValues.length === 0) return false

	switch (field) {
		case "id":
		case "userId":
		case "user_id": {
			const validValues = normalizedValues.filter(isValidUuid)
			if (validValues.length === 0) return true

			pushInClause(clauses, values, "id", validValues)
			return false
		}
		case "username":
			pushContainsClause(clauses, values, "username", normalizedValues)
			return false
		case "email":
			pushContainsClause(clauses, values, "email", normalizedValues)
			return false
		case "role":
			pushInClause(clauses, values, "role", normalizedValues)
			return false
		case "balance": {
			const numericValues = parseNumericValues(normalizedValues)
			if (numericValues.length === 0) return true

			pushInClause(clauses, values, "balance", numericValues)
			return false
		}
		case "createdAt":
		case "created_at":
			pushInClause(clauses, values, "created_at", normalizedValues)
			return false
		case "updatedAt":
		case "updated_at":
			pushInClause(clauses, values, "updated_at", normalizedValues)
			return false
		default:
			return false
	}
}

const buildUserFilters = (rawFilters = {}) => {
	const clauses = []
	const values = []
	let impossible = false

	if (rawFilters.id) impossible = applyUserFilter("id", rawFilters.id, clauses, values) || impossible
	if (rawFilters.userId) impossible = applyUserFilter("userId", rawFilters.userId, clauses, values) || impossible
	if (rawFilters.username) impossible = applyUserFilter("username", rawFilters.username, clauses, values) || impossible
	if (rawFilters.email) impossible = applyUserFilter("email", rawFilters.email, clauses, values) || impossible
	if (rawFilters.role) impossible = applyUserFilter("role", rawFilters.role, clauses, values) || impossible
	if (rawFilters.balance) impossible = applyUserFilter("balance", rawFilters.balance, clauses, values) || impossible

	const minBalance = Number(rawFilters.minBalance)
	if (Number.isFinite(minBalance)) {
		values.push(minBalance)
		clauses.push(`balance >= $${values.length}`)
	}

	const maxBalance = Number(rawFilters.maxBalance)
	if (Number.isFinite(maxBalance)) {
		values.push(maxBalance)
		clauses.push(`balance <= $${values.length}`)
	}

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
		impossible = applyUserFilter(filter.field, filter.values, clauses, values) || impossible
	}

	if (impossible) return { where: "WHERE 1 = 0", values: [] }

	const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : ""
	return { where, values }
}

const applyTransactionFilter = (field, rawValues, clauses, values) => {
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
		case "type":
			pushInClause(clauses, values, "type", normalizedValues)
			return false
		case "amount": {
			const numericValues = parseNumericValues(normalizedValues)
			if (numericValues.length === 0) return true

			pushInClause(clauses, values, "amount", numericValues)
			return false
		}
		case "createdAt":
		case "created_at":
			pushInClause(clauses, values, "created_at", normalizedValues)
			return false
		default:
			return false
	}
}

const buildTransactionFilters = (userId, rawFilters = {}) => {
	if (!isValidUuid(userId)) return { where: "WHERE 1 = 0", values: [] }

	const clauses = []
	const values = [userId]
	let impossible = false

	clauses.push("user_id = $1")

	if (rawFilters.id) impossible = applyTransactionFilter("id", rawFilters.id, clauses, values) || impossible
	if (rawFilters.type) impossible = applyTransactionFilter("type", rawFilters.type, clauses, values) || impossible
	if (rawFilters.amount) impossible = applyTransactionFilter("amount", rawFilters.amount, clauses, values) || impossible

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

	const minAmount = Number(rawFilters.minAmount)
	if (Number.isFinite(minAmount)) {
		values.push(minAmount)
		clauses.push(`amount >= $${values.length}`)
	}

	const maxAmount = Number(rawFilters.maxAmount)
	if (Number.isFinite(maxAmount)) {
		values.push(maxAmount)
		clauses.push(`amount <= $${values.length}`)
	}

	for (const filter of getFilterGroups(rawFilters)) {
		impossible = applyTransactionFilter(filter.field, filter.values, clauses, values) || impossible
	}

	if (impossible) return { where: "WHERE 1 = 0", values: [] }

	return { where: `WHERE ${clauses.join(" AND ")}`, values }
}

const createUser = async ({ username, email, password, role = "user", balance = 0 }) => {
	const hashedPassword = await hashPassword(password)
	const numericBalance = Number(balance)
	const normalizedBalance = Number.isFinite(numericBalance) && numericBalance >= 0 ? numericBalance : 0
	const normalizedRole = role === "admin" ? "admin" : "user"
	let result

	try {
		result = await db.query(
			"INSERT INTO users (username, email, password, role, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			[username, email, hashedPassword, normalizedRole, normalizedBalance],
		)
	} catch (error) {
		result = error
		throw error
	}

	return result.rows[0].id
}

const findUserByEmail = async (email) => {
	const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
	return result.rows[0] || null
}

const findUserById = async (id) => {
	if (!isValidUuid(String(id))) return null

	const result = await db.query("SELECT id, username, email, role, balance FROM users WHERE id = $1", [id])
	return result.rows[0] || null
}

const findAllUsers = async () => {
	const result = await db.query("SELECT id, username, email, role, balance FROM users")
	return result.rows
}

const countUsers = async (filters = {}) => {
	const { where, values } = buildUserFilters(filters)
	const result = await db.query(`SELECT COUNT(*)::int AS count FROM users ${where}`, values)
	return result.rows[0]?.count ?? 0
}

const findUsers = async (page = 1, limit = 20, filters = {}) => {
	if (limit > 100) limit = 100
	if (page < 1) page = 1

	const offset = (page - 1) * limit
	const selectedColumns = getSelectedColumns(filters.columns, USER_SELECTABLE_COLUMNS, USER_DEFAULT_COLUMNS).join(", ")
	const orderBy = getSortClause({
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		allowedColumns: USER_SELECTABLE_COLUMNS,
		defaultSort: "ORDER BY username ASC",
	})
	const { where, values } = buildUserFilters(filters)
	const result = await db.query(
		`SELECT ${selectedColumns} FROM users ${where} ${orderBy} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
		[...values, limit, offset],
	)

	return result.rows
}

const updateUser = async (id, newData) => {
	if (!isValidUuid(String(id))) return false
	if (!newData || typeof newData !== "object" || Array.isArray(newData)) return false

	const keys = Object.keys(newData).filter((key) => Object.prototype.hasOwnProperty.call(updatableUserColumns, key) && newData[key] !== undefined)
	if (keys.length === 0) return false

	const values = []
	const setParts = []

	for (const key of keys) {
		const column = updatableUserColumns[key]
		let value = newData[key]

		if (key === "password") {
			if (typeof value !== "string" || value.length === 0) return false
			value = await hashPassword(value)
		}

		values.push(value)
		setParts.push(`"${column}" = $${values.length}`)
	}
	values.push(id)

	const result = await db.query(`UPDATE users SET ${setParts.join(", ")} WHERE id = $${values.length}`, values)
	return result.rowCount > 0
}

const verifyPassword = async (hashedPassword, plainPassword) => await comparePassword(hashedPassword, plainPassword)

const deleteUser = async (id) => {
	if (!isValidUuid(String(id))) return false

	const result = await db.query("DELETE FROM users WHERE id = $1", [id])
	return result.rowCount > 0
}

const getUserBalance = async (id) => {
	if (!isValidUuid(String(id))) return null

	const result = await db.query("SELECT balance FROM users WHERE id = $1", [id])
	return result.rows[0]?.balance ?? null
}

const updateUserBalance = async (id, amount, options = {}) => {
	if (!isValidUuid(String(id))) return null

	const numericAmount = Number(amount)
	if (!Number.isFinite(numericAmount) || numericAmount === 0) return null

	if (options.type !== undefined && !isTransactionType(options.type)) {
		throw new Error(`INVALID_TRANSACTION_TYPE: ${options.type}`)
	}

	const transactionType = options.type ?? getDefaultTransactionType(numericAmount)
	const result = await db.query(
		`WITH upd AS (
			UPDATE users SET balance = balance + $1
			WHERE id = $2 AND (balance + $1) >= 0
			RETURNING balance
		), ins AS (
			INSERT INTO transactions (user_id, amount, type)
			SELECT $2, abs($1), $3::transaction_type
			WHERE EXISTS (SELECT 1 FROM upd)
			RETURNING id
		)
		SELECT balance FROM upd;
		`,
		[numericAmount, id, transactionType],
	)

	return result.rows[0]?.balance ?? null
}

const countTransactionsByUser = async (userId, filters = {}) => {
	const { where, values } = buildTransactionFilters(userId, filters)
	const result = await db.query(`SELECT COUNT(*)::int AS count FROM transactions ${where}`, values)
	return result.rows[0]?.count ?? 0
}

const findTransactionsByUser = async (userId, page = 1, limit = 20, filters = {}) => {
	if (limit > 100) limit = 100
	if (page < 1) page = 1

	const offset = (page - 1) * limit
	const selectedColumns = getSelectedColumns(filters.columns, TRANSACTION_SELECTABLE_COLUMNS, TRANSACTION_DEFAULT_COLUMNS).join(", ")
	const orderBy = getSortClause({
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		allowedColumns: TRANSACTION_SELECTABLE_COLUMNS,
		defaultSort: "ORDER BY created_at DESC",
	})
	const { where, values } = buildTransactionFilters(userId, filters)
	const result = await db.query(
		`SELECT ${selectedColumns} FROM transactions ${where} ${orderBy} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
		[...values, limit, offset],
	)

	return result.rows
}

export default {
	createUser,
	findUserByEmail,
	findUserById,
	findAllUsers,
	verifyPassword,
	deleteUser,
	updateUser,
	getUserBalance,
	updateUserBalance,
	findTransactionsByUser,
	findAllUsers,
	findUsers,
	countUsers,
	countTransactionsByUser,
}
