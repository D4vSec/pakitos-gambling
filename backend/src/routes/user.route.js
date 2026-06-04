import express from "express"
import {
	createUserByAdmin,
	getProfile,
	getAllUsers,
	deleteSelf,
	updateSelf,
	getUserById,
	updateUserById,
	deleteUserById,
	getSelfBalance,
	getTransactions,
	getSessions,
	revokeSession,
	createTransaction,
	getTransactionsByUserId,
	getSessionsByUserId,
	revokeSessionByUserId,
} from "#controllers/user.controller"
import authMiddleware from "#middlewares/auth.middleware"
import adminMiddleware from "#middlewares/admin.middleware"

const userRoutes = express.Router()

userRoutes.get("/me", authMiddleware, getProfile)
userRoutes.put("/me", authMiddleware, updateSelf)
userRoutes.delete("/me", authMiddleware, deleteSelf)

userRoutes.get("/me/balance", authMiddleware, getSelfBalance)
userRoutes.get("/me/transactions", authMiddleware, getTransactions)
userRoutes.get("/me/sessions", authMiddleware, getSessions)
userRoutes.delete("/me/sessions/:sessionId", authMiddleware, revokeSession)
userRoutes.post("/me/transactions", authMiddleware, createTransaction)

userRoutes.post("/", authMiddleware, adminMiddleware, createUserByAdmin)
userRoutes.get("/", authMiddleware, adminMiddleware, getAllUsers)
userRoutes.get("/:id", authMiddleware, adminMiddleware, getUserById)
userRoutes.put("/:id", authMiddleware, adminMiddleware, updateUserById)
userRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteUserById)
userRoutes.get("/:id/transactions", authMiddleware, adminMiddleware, getTransactionsByUserId)
userRoutes.get("/:id/sessions", authMiddleware, adminMiddleware, getSessionsByUserId)
userRoutes.delete("/:id/sessions/:sessionId", authMiddleware, adminMiddleware, revokeSessionByUserId)

export default userRoutes
