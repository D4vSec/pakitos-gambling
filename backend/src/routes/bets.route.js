import express from "express"
import {
    closeBet,
    createBet,
    deleteBet,
    getAdminBet,
    getAdminBets,
    getBets,
    getBetInfo,
    getSettlementPreview,
    settleBet,
    placeBet,
    updateBet,
} from "#controllers/bets.controller"
import authMiddleware from "#middlewares/auth.middleware"
import adminMiddleware from "#middlewares/admin.middleware"
import { gameLimiter } from "#middlewares/ratelimit.middleware"

const betsRoutes = express.Router()

betsRoutes.get("/", authMiddleware, gameLimiter, getBets)
betsRoutes.get("/admin", authMiddleware, adminMiddleware, gameLimiter, getAdminBets)
betsRoutes.post("/admin", authMiddleware, adminMiddleware, gameLimiter, createBet)
betsRoutes.get("/admin/:betId", authMiddleware, adminMiddleware, gameLimiter, getAdminBet)
betsRoutes.post("/admin/:betId/close", authMiddleware, adminMiddleware, gameLimiter, closeBet)
betsRoutes.post("/admin/:betId/settlement-preview", authMiddleware, adminMiddleware, gameLimiter, getSettlementPreview)
betsRoutes.post("/admin/:betId/settle", authMiddleware, adminMiddleware, gameLimiter, settleBet)
betsRoutes.get("/:betId", authMiddleware, gameLimiter, getBetInfo)
betsRoutes.delete("/:betId", authMiddleware, adminMiddleware, gameLimiter, deleteBet)
betsRoutes.put("/:betId", authMiddleware, adminMiddleware, gameLimiter, updateBet)

betsRoutes.post("/:betId/place", authMiddleware, gameLimiter, placeBet)

export default betsRoutes
