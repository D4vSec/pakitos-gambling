import express from "express"
import { getProfile, getAllUsers, deleteSelf, updateSelf } from "#controllers/userController"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"

const userRoutes = express.Router()

userRoutes.get("/me", authMiddleware, getProfile)
userRoutes.put("/me", authMiddleware, updateSelf)
userRoutes.delete("/me", authMiddleware, deleteSelf)

userRoutes.get("/", authMiddleware, adminMiddleware, getAllUsers)
userRoutes.get("/:id", authMiddleware, adminMiddleware)
userRoutes.put("/:id", authMiddleware, adminMiddleware)
userRoutes.delete("/:id", authMiddleware, adminMiddleware)

export default userRoutes
