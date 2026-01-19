const rateLimit = require("express-rate-limit")
const config = require("@config/rateLimitConfig")

const authLimiter = rateLimit({
    windowMs: config.auth.windowMs,
    max: config.auth.max,
    message: { error: config.auth.message },
    standardHeaders: true,
    legacyHeaders: false,
})

const registrationLimiter = rateLimit({
    windowMs: config.registration.windowMs,
    max: config.registration.max,
    message: { error: config.registration.message },
    standardHeaders: true,
    legacyHeaders: false,
})

const gameLimiter = rateLimit({
    windowMs: config.games.windowMs,
    max: config.games.max,
    message: { error: config.games.message },
    standardHeaders: true,
    legacyHeaders: false,
})

const historyLimiter = rateLimit({
    windowMs: config.history.windowMs,
    max: config.history.max,
    message: { error: config.history.message },
    standardHeaders: true,
    legacyHeaders: false,
})

const globalLimiter = rateLimit({
    windowMs: config.global.windowMs,
    max: config.global.max,
    message: { error: config.global.message },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = { authLimiter, registrationLimiter, gameLimiter, historyLimiter, globalLimiter }
