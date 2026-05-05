import express from "express"
import spinRoulette from "#controllers/roulette.controller"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"
import authMiddleware from "#middlewares/authMiddleware"

const rouletteRoutes = express.Router()

rouletteRoutes.post("/spin", gameLimiter, authMiddleware, spinRoulette)

export default rouletteRoutes
