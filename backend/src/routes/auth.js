import express from "express"
import { register, login } from "#controllers/authController"
import { registrationLimiter } from "#@/middlewares/rateLimitMiddleware"

const authRoutes = express.Router()

authRoutes.post("/register", registrationLimiter, register)
authRoutes.post("/login", login)

export default authRoutes
