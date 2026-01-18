const cors = require("cors")

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

module.exports = cors(corsOptions)