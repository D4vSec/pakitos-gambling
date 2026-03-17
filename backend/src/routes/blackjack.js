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
} from "#controllers/blackjackController"

const blackJackRoutes = express.Router()

blackJackRoutes.post("/start", gameLimiter, authMiddleware, startGame)
blackJackRoutes.post("/:gameId/hit/", gameLimiter, authMiddleware, hit)
blackJackRoutes.post("/:gameId/stand", gameLimiter, authMiddleware, stand)
blackJackRoutes.post("/:gameId/double", gameLimiter, authMiddleware, double)
blackJackRoutes.delete("/:gameId", authMiddleware, deleteGame)
//DEV: Testing method, will be removed in the final version
blackJackRoutes.get("/games", authMiddleware, getGames)

export default blackJackRoutes
