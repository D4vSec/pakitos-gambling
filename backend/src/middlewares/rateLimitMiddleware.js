import rateLimit from "express-rate-limit"
import rateLimitConfig from "#config/ratelimit"

const authLimiter = rateLimit({
	windowMs: rateLimitConfig.auth.windowMs,
	max: rateLimitConfig.auth.max,
	message: { error: rateLimitConfig.auth.message },
	standardHeaders: true,
	legacyHeaders: false,
})

const registrationLimiter = rateLimit({
	windowMs: rateLimitConfig.registration.windowMs,
	max: rateLimitConfig.registration.max,
	message: { error: rateLimitConfig.registration.message },
	standardHeaders: true,
	legacyHeaders: false,
})

const gameLimiter = rateLimit({
	windowMs: rateLimitConfig.games.windowMs,
	max: rateLimitConfig.games.max,
	message: { error: rateLimitConfig.games.message },
	standardHeaders: true,
	legacyHeaders: false,
})

const historyLimiter = rateLimit({
	windowMs: rateLimitConfig.history.windowMs,
	max: rateLimitConfig.history.max,
	message: { error: rateLimitConfig.history.message },
	standardHeaders: true,
	legacyHeaders: false,
})

const globalLimiter = rateLimit({
	windowMs: rateLimitConfig.global.windowMs,
	max: rateLimitConfig.global.max,
	message: { error: rateLimitConfig.global.message },
	standardHeaders: true,
	legacyHeaders: false,
})

export { authLimiter, registrationLimiter, gameLimiter, historyLimiter, globalLimiter }
