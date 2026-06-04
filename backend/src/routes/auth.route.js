import express from "express"
import { register, login, refresh } from "#controllers/auth.controller"
import { authLimiter, registrationLimiter } from "#middlewares/ratelimit.middleware"

const authRoutes = express.Router()

authRoutes.post("/register", registrationLimiter, register)
authRoutes.post("/login", authLimiter, login)
authRoutes.post("/refresh", refresh)

export default authRoutes
