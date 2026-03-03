import express from "express"
import { createSlot, spinSlot, getSlotSession, endSlotSession } from "#controllers/slotsController"
import authMiddleware from "#middlewares/authMiddleware"
import { gameLimiter } from "#middlewares/rateLimitMiddleware"

const slotsRoutes = express.Router()

slotsRoutes.post("/create", authMiddleware, gameLimiter, createSlot)
slotsRoutes.post("/:gameId/spin", authMiddleware, gameLimiter, spinSlot)
slotsRoutes.get("/:gameId", authMiddleware, getSlotSession)
slotsRoutes.delete("/:gameId", authMiddleware, endSlotSession)

export default slotsRoutes
