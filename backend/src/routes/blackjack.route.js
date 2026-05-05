import express from "express"
import { gameLimiter } from "#middlewares/ratelimit.middleware"
import authMiddleware from "#middlewares/auth.middleware"
import adminMiddleware from "#middlewares/admin.middleware"
import { startGame, hit, stand, double, split, getGame, deleteGame, getGames } from "#controllers/blackjack.controller"
import { isDev } from "#utils/logger"

const blackJackRoutes = express.Router()

blackJackRoutes.post("/start", gameLimiter, authMiddleware, startGame)
blackJackRoutes.post("/:gameId/hit", gameLimiter, authMiddleware, hit)
blackJackRoutes.post("/:gameId/stand", gameLimiter, authMiddleware, stand)
blackJackRoutes.post("/:gameId/double", gameLimiter, authMiddleware, double)
blackJackRoutes.post("/:gameId/split", gameLimiter, authMiddleware, split)

if (isDev) 
    blackJackRoutes.get("/games", authMiddleware, adminMiddleware, getGames)

blackJackRoutes.get("/:gameId", authMiddleware, getGame)
blackJackRoutes.delete("/:gameId", authMiddleware, deleteGame)

export default blackJackRoutes
