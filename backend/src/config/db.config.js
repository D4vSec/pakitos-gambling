import { Pool } from "pg"
import { AUDIT_TYPES } from "#config/audit.config"
import logger from "#utils/logger.utils"

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT || 5432,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
})

const ensureAuditActionTypes = async (client) => {
	const typeResult = await client.query(
		"SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') AS exists",
	)

	if (!typeResult.rows[0]?.exists) return

	for (const action of AUDIT_TYPES) {
		await client.query(`ALTER TYPE audit_action ADD VALUE IF NOT EXISTS '${action}'`)
	}
}

const db = {
	connect: async () => {
		let client
		try {
			client = await pool.connect()
			await ensureAuditActionTypes(client)
			logger.info("Database connected")
		} catch (err) {
			logger.fatal("DB connection error:", err)
			throw err
		} finally {
			client?.release()
		}
	},
	getClient: () => pool.connect(),
	query: (text, params) => pool.query(text, params),
}

export default db
export { ensureAuditActionTypes }
