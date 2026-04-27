import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { express as useragent } from 'express-useragent';

import { globalLimiter } from '#middlewares/rateLimitMiddleware'
import userRoutes from '#routes/user'
import authRoutes from '#routes/auth'
import rouletteRoutes from '#routes/roulette'
import slotsRoutes from '#routes/slots'
import blackJackRoutes from '#routes/blackjack'
import betsRoutes from '#routes/bets'
import auditRoutes from '#routes/audit'

import corsConfig from '#config/cors'

const API_VERSION = 'v1'
const app = express()

app.set('trust proxy', 1)
app.use(express.json({ limit: '10kb', strict: true }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(helmet())
app.use(cors(corsConfig))
app.use(useragent());
app.disable('x-powered-by')

app.use(`/${API_VERSION}`, globalLimiter)
app.use(`/${API_VERSION}/user`, userRoutes)
app.use(`/${API_VERSION}/auth`, authRoutes)
app.use(`/${API_VERSION}/roulette`, rouletteRoutes)
app.use(`/${API_VERSION}/slots`, slotsRoutes)
app.use(`/${API_VERSION}/blackjack`, blackJackRoutes)
app.use(`/${API_VERSION}/bets`, betsRoutes)
app.use(`/${API_VERSION}/audit`, auditRoutes)

app.use((req, res) => {
	res.status(404).json({
		code: 'NOT_FOUND',
	})
})

app.use((err, req, res, next) => {
	console.error('[Error]:', err)
	const statusCode = err.status || err.statusCode || 500

	res.status(statusCode).json({
		code: err.code || 'INTERNAL_SERVER_ERROR',
	})
})

export default app
