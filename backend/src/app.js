import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { express as useragent } from 'express-useragent';

import { globalLimiter } from '#middlewares/ratelimit.middleware'
import userRoutes from '#routes/user.route'
import authRoutes from '#routes/auth.route'
import rouletteRoutes from '#routes/roulette.route'
import slotsRoutes from '#routes/slots.route'
import blackJackRoutes from '#routes/blackjack.route'
import capyRoadRoutes from '#routes/capyroad.route'
import betsRoutes from '#routes/bets.route'
import auditRoutes from '#routes/audit.route'

import corsConfig from '#config/cors.config'
import logger from '#utils/logger.utils'

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
app.use(`/${API_VERSION}/capyroad`, capyRoadRoutes)
app.use(`/${API_VERSION}/audit`, auditRoutes)

app.use((req, res) => {
	res.status(404).json({
		code: 'NOT_FOUND',
	})
})

app.use((err, req, res, next) => {
	logger.error(err)
	const statusCode = err.status || err.statusCode || 500

	res.status(statusCode).json({
		code: err.code || 'INTERNAL_SERVER_ERROR',
	})
})

export default app
