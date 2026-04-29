import express from "express"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"
import { startGame, hit, stand, double, split, getGame, deleteGame, getGames } from "#controllers/blackjackController"
import { isDev } from "#utils/logger"

const blackJackRoutes = express.Router()

blackJackRoutes.post("/start", gameLimiter, authMiddleware, startGame)
blackJackRoutes.post("/:gameId/hit", gameLimiter, authMiddleware, hit)
blackJackRoutes.post("/:gameId/stand", gameLimiter, authMiddleware, stand)
blackJackRoutes.post("/:gameId/double", gameLimiter, authMiddleware, double)
blackJackRoutes.post("/:gameId/split", gameLimiter, authMiddleware, split)
blackJackRoutes.get("/:gameId", authMiddleware, getGame)
blackJackRoutes.delete("/:gameId", authMiddleware, deleteGame)

if (isDev) {
    blackJackRoutes.get("/games", authMiddleware, adminMiddleware, getGames)
}

export default blackJackRoutes
