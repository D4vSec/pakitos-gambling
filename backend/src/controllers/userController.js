import User from '#models/userModel'
import * as z from 'zod'
import { DEBIT_TRANSACTION_TYPES, TRANSACTION_TYPES, ALLOWED_TRANSACTION_ENDPOINT, getSignedTransactionAmount } from '#config/transactions'
import logger from "#utils/logger"

const getProfile = async (req, res) => {
	try {
		const user = await User.findUserById(req.user.id)

		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.json({
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			balance: user.balance,
		})
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getAllUsers = async (req, res) => {
	try {
		const schema = z
			.object({
				page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
				limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
			})
			.strict()

		const { page = 1, limit = 20 } = schema.parse(req.query)

		const total = await User.countUsers()
		const users = await User.findUsers(page, limit)
		const totalPages = Math.max(1, Math.ceil(total / limit))

		res.json({ page: page, limit: limit, totalPages: totalPages, users: users || [] })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const deleteSelf = async (req, res) => {
	try {
		const userId = req.user.id
		const deleted = await User.deleteUser(userId)

		if (!deleted) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.status(204).send()
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const updateSelf = async (req, res) => {
	try {
		const userId = req.user.id

		const schema = z
			.object({
				username: z.string().min(3).max(50).optional(),
				email: z.string().email().optional(),
				password: z.string().min(8).optional(),
			})
			.strict()

		const data = schema.parse(req.body)
		const updated = await User.updateUser(userId, data)

		if (!updated) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.status(200).json({ code: 'SUCCESS' })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ errors: err.errors })
		}
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getUserById = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findUserById(id)

		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.json({
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			balance: user.balance,
		})
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const updateUserById = async (req, res) => {
	try {
		const { id } = req.params

		const schema = z
			.object({
				username: z.string().min(3).max(50).optional(),
				email: z.string().email().optional(),
				password: z.string().min(8).optional(),
				role: z.enum(['user', 'admin']).optional(),
			})
			.strict()

		const data = schema.parse(req.body)

		// Password hashing is handled by the model (`User.updateUser`).

		const updated = await User.updateUser(id, data)

		if (!updated) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.status(200).json({ code: 'SUCCESS' })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ errors: err.errors })
		}
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const deleteUserById = async (req, res) => {
	try {
		const { id } = req.params
		const deleted = await User.deleteUser(id)

		if (!deleted) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.status(204).send()
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getSelfBalance = async (req, res) => {
	try {
		const userId = req.user.id
		const balance = await User.getUserBalance(userId)

		if (balance === null) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		res.json({ balance })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getTransactions = async (req, res) => {
	try {
		const schema = z
			.object({
				page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
				limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
			})
			.strict()

		const { page = 1, limit = 20 } = schema.parse(req.query)

		const total = await User.countTransactionsByUser(req.user.id)
		const totalPages = Math.max(1, Math.ceil(total / limit))
		if (page > totalPages) return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const txs = await User.findTransactionsByUser(req.user.id, page, limit)
		res.json({ page, limit, totalPages, transactions: txs })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const createTransaction = async (req, res) => {
	try {
		const schema = z
			.object({
				type: z.enum(Array.from(ALLOWED_TRANSACTION_ENDPOINT)),
				amount: z.preprocess((v) => {
					if (v === undefined || v === null) return v
					const n = Number(v)
					return Number.isFinite(n) ? n : v
				}, z.number().positive()),
			})
			.strict()

		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({
				code: 'INVALID_TRANSACTION_DATA',
			})
		}

		const parseResult = schema.safeParse(req.body)
		if (!parseResult.success) {
			return res.status(400).json({
				code: 'INVALID_TRANSACTION_DATA',
			})
		}

		const { type, amount } = parseResult.data

		const userId = req.user.id

		const user = await User.findUserById(userId)
		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const signedAmount = getSignedTransactionAmount(type, amount)
		if (signedAmount === null) {
			return res.status(400).json({
				code: 'INVALID_TRANSACTION_DATA',
			})
		}

		const newBalance = await User.updateUserBalance(userId, signedAmount, { type })

		if (newBalance === null) {
			if (DEBIT_TRANSACTION_TYPES.has(type)) {
				return res.status(400).json({ code: 'INSUFFICIENT_FUNDS' })
			}
			return res.status(500).json({ code: 'ERROR_UPDATING_BALANCE' })
		}

		res.status(200).json({ balance: newBalance })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getTransactionsByUserId = async (req, res) => {
	try {
		const { id } = req.params
		const schema = z
			.object({
				page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
				limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
			})
			.strict()

		const { page = 1, limit = 20 } = schema.parse(req.query)

		const user = await User.findUserById(id)
		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const total = await User.countTransactionsByUser(id)
		const totalPages = Math.max(1, Math.ceil(total / limit))
		if (page > totalPages) return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const txs = await User.findTransactionsByUser(id, page, limit)
		res.json({ page, limit, totalPages, transactions: txs })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

export { getProfile, getAllUsers, deleteSelf, updateSelf, getUserById, updateUserById, deleteUserById, getSelfBalance, getTransactions, createTransaction, getTransactionsByUserId }
