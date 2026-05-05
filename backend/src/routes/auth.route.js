import express from "express"
import { register, login } from "#controllers/auth.controller"
import { authLimiter, registrationLimiter } from "#middlewares/ratelimit.middleware"

const authRoutes = express.Router()

authRoutes.post("/register", registrationLimiter, register)
authRoutes.post("/login", authLimiter, login)

export default authRoutes
