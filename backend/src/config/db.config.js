import { Pool } from "pg"
import logger from "#utils/logger.utils"

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT || 5432,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
})

const db = {
	connect: async () => {
		try {
			const client = await pool.connect()
			client.release()
			logger.info("Database connected")
		} catch (err) {
			logger.fatal("DB connection error:", err)
			throw err
		}
	},
	getClient: () => pool.connect(),
	query: (text, params) => pool.query(text, params),
}

export default db
