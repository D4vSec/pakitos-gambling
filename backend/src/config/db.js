const { Pool } = require("pg")

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

module.exports = {
    connect: async () => {
        try {
            await pool.connect()
            console.log("Database connected")
        } catch (err) {
            console.error("DB connection error:", err)
        }
    },
    query: (text, params) => pool.query(text, params),
}
