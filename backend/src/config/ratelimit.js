const rateLimitConfig = {
	auth: {
		windowMs: 15 * 60 * 1000,
		max: 10,
		code : 'TOO_MANY_ATTEMPTS',
	},
	registration: {
		windowMs: 60 * 60 * 1000,
		max: 10,
		code: 'TOO_MANY_REGISTRATIONS',
	},
	games: {
		windowMs: 1000,
		max: 5,
		code: 'TOO_MANY_GAMES',
	},
	history: {
		windowMs: 60 * 1000,
		max: 20,
		code: 'TOO_MANY_HISTORY_REQUESTS',
	},
	global: {
		windowMs: 1 * 60 * 1000,
		max: 100,
		code: 'TOO_MANY_REQUESTS',
	},
}

export default rateLimitConfig
