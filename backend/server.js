import app from "#@/app"
import db from "#config/db.config"
import logger from "#utils/logger.utils"


const PORT = process.env.API_PORT || 3000

db.connect()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on http://localhost:${PORT}`)

            if (process.env.NODE_ENV === "development")
                logger.warn("Running in development mode. Don't use this in production!")

        })
    })
    .catch((err) => logger.fatal("DB connection error:", err))
