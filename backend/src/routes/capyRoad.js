import express from "express"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"
import {
    startGame,
    jumpRoad,
    deleteGame,
    getGames,
} from "#controllers/capyRoadController"
import { isDev } from "#utils/logger"

const capyRoadRoutes = express.Router()
//TODO: Test the routes
capyRoadRoutes.post("/start", gameLimiter, authMiddleware, startGame)
capyRoadRoutes.post("/:gameId/jump", gameLimiter, authMiddleware, jumpRoad)
capyRoadRoutes.delete("/:gameId", authMiddleware, deleteGame)

if (isDev) {
    capyRoadRoutes.get("/games", authMiddleware, adminMiddleware, getGames)
}

export default capyRoadRoutes