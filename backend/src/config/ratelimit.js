const rateLimitConfig = {
	auth: {
		windowMs: 15 * 60 * 1000,
		max: 10,
		message:
			"Has excedido el número de intentos de inicio de sesión. Por favor, espera un momento antes de volver a intentarlo.",
	},
	registration: {
		windowMs: 60 * 60 * 1000,
		max: 10,
		message: "Has alcanzado el límite de creación de cuentas. Intenta registrarte más tarde.",
	},
	games: {
		windowMs: 1000,
		max: 5,
		message: "Solo puedes realizar un giro por segundo. ¡Tómalo con calma!",
	},
	history: {
		windowMs: 60 * 1000,
		max: 20,
		message:
			"Estás generando demasiadas solicitudes al historial de jugadas. Espera un momento antes de continuar.",
	},
	global: {
		windowMs: 1 * 60 * 1000,
		max: 100,
		message:
			"Hemos detectado tráfico inusual desde tu IP. Por favor, reduce la frecuencia de tus acciones.",
	},
}

export default rateLimitConfig
