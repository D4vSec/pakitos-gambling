import express from "express"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"
import authMiddleware from "#middlewares/authMiddleware"
import {
	startGame,
	hit,
	stand,
	double,
	deleteGame,
	getGames,
} from "#@/controllers/blackjackController"

const blackJackRoutes = express.Router()

blackJackRoutes.post("/start", gameLimiter, authMiddleware, startGame)
blackJackRoutes.post("/hit/:gameId", gameLimiter, authMiddleware, hit)
blackJackRoutes.post("/stand/:gameId", gameLimiter, authMiddleware, stand)
blackJackRoutes.post("/double/:gameId", gameLimiter, authMiddleware, double)
blackJackRoutes.delete("/delete/:gameId", authMiddleware, deleteGame)
//Testing method, will be removed in the final version
blackJackRoutes.get("/games", authMiddleware, getGames)

export default blackJackRoutes
