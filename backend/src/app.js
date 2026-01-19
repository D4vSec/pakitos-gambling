const express = require("express")
const app = express()
const cors = require("@config/cors")

const { globalLimiter } = require("@middlewares/rateLimiters")
const userRoutes = require("@routes/user")

const API_VERSION = "v1"

app.set("trust proxy", 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors)

app.use(`/${API_VERSION}`, globalLimiter)
app.use(`/${API_VERSION}/user`, userRoutes)

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
    })
})

module.exports = app
