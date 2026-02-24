import { hashPassword, comparePassword } from "#utils/password"
import db from "#config/db"

const createUser = async ({ username, email, password }) => {
    const hashedPassword = await hashPassword(password)
    const [result] = await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword])
    return result.insertId
}

const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    return rows[0] || null
}

const findUserById = async (id) => {
    const [rows] = await db.query("SELECT id, username, email, role FROM users WHERE id = ?", [id])
    return rows[0] || null
}

const findAllUsers = async () => {
    const [rows] = await db.query("SELECT id, username, email, role FROM users")
    return rows
}

const verifyPassword = async (hashedPassword, plainPassword) => {
    return await comparePassword(hashedPassword, plainPassword)
}

export default { createUser, findUserByEmail, findUserById, findAllUsers, verifyPassword }