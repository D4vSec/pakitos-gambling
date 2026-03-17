import express from "express"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"
import authMiddleware from "#middlewares/authMiddleware"
import {
    startGame,
    jumpRoad,
    deleteGame,
    getGames,
} from "#controllers/capyRoadController"

const capyRoadRoutes = express.Router()

capyRoadRoutes.post("/start", gameLimiter, authMiddleware, startGame)
capyRoadRoutes.post("/:gameId/jump", gameLimiter, authMiddleware, jumpRoad)
capyRoadRoutes.delete("/:gameId", authMiddleware, deleteGame)
//DEV: Testing method, will be removed in the final version
capyRoadRoutes.get("/games", authMiddleware, getGames)

export default capyRoadRoutes