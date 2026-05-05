import express from "express"
import {
	getProfile,
	getAllUsers,
	deleteSelf,
	updateSelf,
	getUserById,
	updateUserById,
	deleteUserById,
	getSelfBalance,
	getTransactions,
	createTransaction,
	getTransactionsByUserId,
} from "#controllers/user.controller"
import authMiddleware from "#middlewares/authMiddleware"
import adminMiddleware from "#middlewares/adminMiddleware"

const userRoutes = express.Router()

userRoutes.get("/me", authMiddleware, getProfile)
userRoutes.put("/me", authMiddleware, updateSelf)
userRoutes.delete("/me", authMiddleware, deleteSelf)

userRoutes.get("/me/balance", authMiddleware, getSelfBalance)
userRoutes.get("/me/transactions", authMiddleware, getTransactions)
userRoutes.post("/me/transactions", authMiddleware, createTransaction)

userRoutes.get("/", authMiddleware, adminMiddleware, getAllUsers)
userRoutes.get("/:id", authMiddleware, adminMiddleware, getUserById)
userRoutes.put("/:id", authMiddleware, adminMiddleware, updateUserById)
userRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteUserById)
userRoutes.get("/:id/transactions", authMiddleware, adminMiddleware, getTransactionsByUserId)

export default userRoutes
