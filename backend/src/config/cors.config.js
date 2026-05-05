const corsConfig = {
	origin: process.env.CORS_ORIGIN,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
	maxAge: 600,
	credentials: true,
}

export default corsConfig
