import express from "express"
import { getBets, getBetInfo, deleteBet, updateBet, placeBet } from "#controllers/betsController"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"

const betsRoutes = express.Router()

betsRoutes.get("/", authMiddleware, gameLimiter, getBets)
betsRoutes.get("/:betId", authMiddleware, gameLimiter, getBetInfo)
betsRoutes.delete("/:betId", authMiddleware, adminMiddleware, gameLimiter, deleteBet)
betsRoutes.put("/:betId", authMiddleware, adminMiddleware, gameLimiter, updateBet)

betsRoutes.post("/:betId/place", authMiddleware, gameLimiter, placeBet)

export default betsRoutes
