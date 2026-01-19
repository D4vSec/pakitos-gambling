require("module-alias/register")

const app = require("@/app")
const db = require("@config/db")
const PORT = process.env.API_PORT || 3000

db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    })
    .catch((err) => console.error("DB connection error:", err))
