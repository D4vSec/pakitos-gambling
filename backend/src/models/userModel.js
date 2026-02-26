import { hashPassword, comparePassword } from "#utils/password"
import db from "#config/db"

const createUser = async ({ username, email, password }) => {
	const hashedPassword = await hashPassword(password)
	const result = await db.query(
		"INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
		[username, email, hashedPassword],
	)
	return result.rows[0].id
}

const findUserByEmail = async (email) => {
	const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
	return result.rows[0] || null
}

const findUserById = async (id) => {
	const result = await db.query("SELECT id, username, email, role FROM users WHERE id = $1", [id])
	return result.rows[0] || null
}

const findAllUsers = async () => {
	const result = await db.query("SELECT id, username, email, role FROM users")
	return result.rows
}

const updateUser = async (id, newData) => {
	const allowed = ["username", "email", "password", "role"]
	const keys = Object.keys(newData).filter((k) => allowed.includes(k))
	if (keys.length === 0) return false

	const values = []
	for (const k of keys) {
		if (k === "password") {
			values.push(await hashPassword(newData[k]))
		} else {
			values.push(newData[k])
		}
	}

	const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ")
	values.push(id)

	const result = await db.query(
		`UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`,
		values,
	)
	return result.rowCount > 0
}

const verifyPassword = async (hashedPassword, plainPassword) => {
	return await comparePassword(hashedPassword, plainPassword)
}

const deleteUser = async (id) => {
	const result = await db.query("DELETE FROM users WHERE id = $1", [id])
	return result.rowCount > 0
}

export default {
	createUser,
	findUserByEmail,
	findUserById,
	findAllUsers,
	verifyPassword,
	deleteUser,
	updateUser,
}
