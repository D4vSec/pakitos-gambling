import express from "express"
import { getProfile, getAllUsers } from "#controllers/userController"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"

const userRoutes = express.Router()

userRoutes.get("/me", authMiddleware, getProfile)
userRoutes.get("/", authMiddleware, adminMiddleware, getAllUsers)

export default userRoutes
