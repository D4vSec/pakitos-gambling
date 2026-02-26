import express from "express"
import { getProfile, getAllUsers, deleteSelf, updateSelf, getUserById, updateUserById, deleteUserById } from "#controllers/userController"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"

const userRoutes = express.Router()

userRoutes.get("/me", authMiddleware, getProfile)
userRoutes.put("/me", authMiddleware, updateSelf)
userRoutes.delete("/me", authMiddleware, deleteSelf)

userRoutes.get("/", authMiddleware, adminMiddleware, getAllUsers)
userRoutes.get("/:id", authMiddleware, adminMiddleware, getUserById)
userRoutes.put("/:id", authMiddleware, adminMiddleware, updateUserById)
userRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteUserById)

export default userRoutes
