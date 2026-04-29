import { hashPassword, comparePassword } from '#utils/password'
import db from '#config/db'
import { getDefaultTransactionType, isTransactionType } from '#config/transactions'

const updatableUserColumns = Object.freeze({
	username: 'username',
	email: 'email',
	password: 'password',
	role: 'role',
})

const createUser = async ({ username, email, password }) => {
	const hashedPassword = await hashPassword(password)
	let result

	try {
		result = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id', [username, email, hashedPassword])
	} catch (error) {
		result = error
		throw error
	}

	return result.rows[0].id
}

const findUserByEmail = async (email) => {
	const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
	return result.rows[0] || null
}

const findUserById = async (id) => {
	const result = await db.query('SELECT id, username, email, role, balance FROM users WHERE id = $1', [id])
	return result.rows[0] || null
}

const findAllUsers = async () => {
	const result = await db.query('SELECT id, username, email, role, balance FROM users')
	return result.rows
}

const updateUser = async (id, newData) => {
	if (id === undefined || id === null || id === '') return false
	if (!newData || typeof newData !== 'object' || Array.isArray(newData)) return false

	const keys = Object.keys(newData).filter((key) => Object.prototype.hasOwnProperty.call(updatableUserColumns, key) && newData[key] !== undefined)
	if (keys.length === 0) return false

	const values = []
	const setParts = []

	for (const key of keys) {
		const column = updatableUserColumns[key]
		let value = newData[key]

		if (key === 'password') {
			if (typeof value !== 'string' || value.length === 0) return false
			value = await hashPassword(value)
		}

		values.push(value)
		setParts.push(`"${column}" = $${values.length}`)
	}
	values.push(id)

	const result = await db.query(`UPDATE users SET ${setParts.join(', ')} WHERE id = $${values.length}`, values)
	return result.rowCount > 0
}

const verifyPassword = async (hashedPassword, plainPassword) => {
	return await comparePassword(hashedPassword, plainPassword)
}

const deleteUser = async (id) => {
	const result = await db.query('DELETE FROM users WHERE id = $1', [id])
	return result.rowCount > 0
}

const getUserBalance = async (id) => {
	const result = await db.query('SELECT balance FROM users WHERE id = $1', [id])
	return result.rows[0]?.balance ?? null
}

const updateUserBalance = async (id, amount, options = {}) => {
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

const findTransactionsByUser = async (userId, page = 1, limit = 20) => {
	if (limit > 100) limit = 100
	if (page < 1) page = 1
	
	const offset = (page - 1) * limit
	const result = await db.query('SELECT id, amount, type, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset])
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
}
