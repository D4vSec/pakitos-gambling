import express from "express"
import { getBets, getBetInfo, deleteBet, updateBet, placeBet } from "#controllers/bets.controller"
import authMiddleware from "#middlewares/auth.middleware"
import adminMiddleware from "#middlewares/admin.middleware"
import { gameLimiter } from "#middlewares/ratelimit.middleware"

const betsRoutes = express.Router()

betsRoutes.get("/", authMiddleware, gameLimiter, getBets)
betsRoutes.get("/:betId", authMiddleware, gameLimiter, getBetInfo)
betsRoutes.delete("/:betId", authMiddleware, adminMiddleware, gameLimiter, deleteBet)
betsRoutes.put("/:betId", authMiddleware, adminMiddleware, gameLimiter, updateBet)

betsRoutes.post("/:betId/place", authMiddleware, gameLimiter, placeBet)

export default betsRoutes
