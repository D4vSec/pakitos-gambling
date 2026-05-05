import express from "express"
import spinRoulette from "#controllers/roulette.controller"
import { gameLimiter } from "#middlewares/ratelimit.middleware"
import authMiddleware from "#middlewares/auth.middleware"

const rouletteRoutes = express.Router()

rouletteRoutes.post("/spin", gameLimiter, authMiddleware, spinRoulette)

export default rouletteRoutes
