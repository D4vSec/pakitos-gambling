import { Pool } from "pg"
import logger from "#utils/logger"

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
			await pool.connect()
			logger.info("Database connected")
		} catch (err) {
			logger.fatal("DB connection error:", err)
		}
	},
	query: (text, params) => pool.query(text, params),
}

export default db
