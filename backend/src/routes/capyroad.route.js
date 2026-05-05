import express from "express"
import { gameLimiter } from "#middlewares/ratelimit.middleware"
import authMiddleware from "#middlewares/auth.middleware"
import adminMiddleware from "#middlewares/admin.middleware"
import {
    startGame,
    jumpRoad,
    deleteGame,
    getGames,
} from "#controllers/capyroad.controller"
import { isDev } from "#utils/logger.utils"

const capyRoadRoutes = express.Router()
//TODO: Test the routes
capyRoadRoutes.post("/start", gameLimiter, authMiddleware, startGame)
capyRoadRoutes.post("/:gameId/jump", gameLimiter, authMiddleware, jumpRoad)
capyRoadRoutes.delete("/:gameId", authMiddleware, deleteGame)

if (isDev) 
    capyRoadRoutes.get("/games", authMiddleware, adminMiddleware, getGames)


export default capyRoadRoutes