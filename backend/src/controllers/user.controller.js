import User from '#models/user.model'
import Session from '#models/session.model'
import * as z from 'zod'
import {
	TRANSACTION_FILTER_FIELDS,
	TRANSACTION_SELECTABLE_COLUMNS,
	TRANSACTION_TYPES,
	SORT_ORDERS,
	USER_FILTER_FIELDS,
	USER_ROLES,
	USER_SELECTABLE_COLUMNS,
} from '#config/admin-filters.config'
import Audit from '#services/audit.service'
import { DEBIT_TRANSACTION_TYPES, ALLOWED_TRANSACTION_ENDPOINT, getSignedTransactionAmount } from '#config/transactions.config'
import { isValidUuid } from '#utils/admin-query.utils'
import {
	createListQuerySchema,
	createStructuredFiltersSchema,
	csvEnumSchema,
	csvNumberSchema,
	csvTextSchema,
	csvUuidSchema,
	optionalColumnsSchema,
	toOptionalNumber,
} from '#utils/admin-query-validation.utils'
import logger from "#utils/logger.utils"

const userColumnKeys = Object.freeze(Object.keys(USER_SELECTABLE_COLUMNS))
const transactionColumnKeys = Object.freeze(Object.keys(TRANSACTION_SELECTABLE_COLUMNS))

const userFilterValueSchemas = Object.freeze({
	id: csvUuidSchema(),
	userId: csvUuidSchema(),
	user_id: csvUuidSchema(),
	username: csvTextSchema(),
	email: csvTextSchema(),
	role: csvEnumSchema(USER_ROLES),
	balance: csvNumberSchema(),
	createdAt: csvTextSchema(),
	created_at: csvTextSchema(),
	updatedAt: csvTextSchema(),
	updated_at: csvTextSchema(),
})

const transactionFilterValueSchemas = Object.freeze({
	id: csvUuidSchema(),
	userId: csvUuidSchema(),
	user_id: csvUuidSchema(),
	type: csvEnumSchema(TRANSACTION_TYPES),
	amount: csvNumberSchema(),
	createdAt: csvTextSchema(),
	created_at: csvTextSchema(),
})

const usersListQuerySchema = createListQuerySchema({
	id: userFilterValueSchemas.id.optional(),
	userId: userFilterValueSchemas.userId.optional(),
	username: userFilterValueSchemas.username.optional(),
	email: userFilterValueSchemas.email.optional(),
	role: userFilterValueSchemas.role.optional(),
	balance: userFilterValueSchemas.balance.optional(),
	minBalance: z.preprocess((value) => toOptionalNumber(value), z.number().finite()).optional(),
	maxBalance: z.preprocess((value) => toOptionalNumber(value), z.number().finite()).optional(),
	columns: optionalColumnsSchema(userColumnKeys),
	sortBy: z.enum(userColumnKeys).optional(),
	sortOrder: z.enum(SORT_ORDERS).optional(),
	filterField: z.enum(USER_FILTER_FIELDS).optional(),
	filterBy: z.enum(USER_FILTER_FIELDS).optional(),
	column: z.enum(USER_FILTER_FIELDS).optional(),
	filterValue: z.unknown().optional(),
	filterValues: z.unknown().optional(),
	value: z.unknown().optional(),
	filters: createStructuredFiltersSchema(USER_FILTER_FIELDS, userFilterValueSchemas),
})

const transactionsListQuerySchema = createListQuerySchema({
	id: transactionFilterValueSchemas.id.optional(),
	type: transactionFilterValueSchemas.type.optional(),
	amount: transactionFilterValueSchemas.amount.optional(),
	minAmount: z.preprocess((value) => toOptionalNumber(value), z.number().finite()).optional(),
	maxAmount: z.preprocess((value) => toOptionalNumber(value), z.number().finite()).optional(),
	columns: optionalColumnsSchema(transactionColumnKeys),
	sortBy: z.enum(transactionColumnKeys).optional(),
	sortOrder: z.enum(SORT_ORDERS).optional(),
	filterField: z.enum(TRANSACTION_FILTER_FIELDS).optional(),
	filterBy: z.enum(TRANSACTION_FILTER_FIELDS).optional(),
	column: z.enum(TRANSACTION_FILTER_FIELDS).optional(),
	filterValue: z.unknown().optional(),
	filterValues: z.unknown().optional(),
	value: z.unknown().optional(),
	filters: createStructuredFiltersSchema(TRANSACTION_FILTER_FIELDS, transactionFilterValueSchemas),
})

const parseListQuery = (query, schema, fieldValueSchemas = {}) => {
	const parsedQuery = schema.safeParse(query || {})
	if (!parsedQuery.success) {
		return { error: parsedQuery.error.issues }
	}

	const singleFilterField = parsedQuery.data.filterField ?? parsedQuery.data.filterBy ?? parsedQuery.data.column
	if (singleFilterField) {
		const singleFilterValue = parsedQuery.data.filterValues ?? parsedQuery.data.filterValue ?? parsedQuery.data.value
		const singleFilterSchema = fieldValueSchemas[singleFilterField]
		const parseSingleFilter = singleFilterSchema?.safeParse(singleFilterValue)

		if (!parseSingleFilter?.success) {
			return { error: parseSingleFilter?.error?.issues ?? [{ message: 'INVALID_FILTER_VALUE' }] }
		}
	}

	const filters = { ...parsedQuery.data }
	delete filters.page
	delete filters.limit

	if (parsedQuery.data.fromDate && parsedQuery.data.toDate) {
		const fromDate = new Date(parsedQuery.data.fromDate)
		const toDate = new Date(parsedQuery.data.toDate)

		if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime()) && fromDate > toDate) {
			return { dateRangeError: true }
		}
	}

	return {
		page: parsedQuery.data.page ?? 1,
		limit: Math.min(parsedQuery.data.limit ?? 20, 100),
		filters,
	}
}

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
		const parsedQuery = parseListQuery(req.query, usersListQuerySchema, userFilterValueSchemas)
		if (parsedQuery.error) return res.status(400).json({ errors: parsedQuery.error })
		if (parsedQuery.dateRangeError) return res.status(400).json({ code: 'INVALID_DATE_RANGE' })

		const { page, limit, filters } = parsedQuery
		const total = await User.countUsers(filters)
		const users = await User.findUsers(page, limit, filters)
		const totalPages = Math.max(1, Math.ceil(total / limit))

		res.json({ page, limit, totalPages, users: users || [] })
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
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

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
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

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

		const deviceInfo = Audit.getUserAgentRaw(req)
		Audit.createAudit({
			user_id: req.user.id,
			action: 'ADMIN_ACTION',
			details: { type: 'USER_UPDATED', targetUserId: id, changes: Object.keys(data), date: new Date().toISOString() },
			ip_address: Audit.getClientIp(req),
			user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
		})

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
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const deleted = await User.deleteUser(id)

		if (!deleted) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const deviceInfo = Audit.getUserAgentRaw(req)
		Audit.createAudit({
			user_id: req.user.id,
			action: 'ADMIN_ACTION',
			details: { type: 'USER_DELETED', targetUserId: id, date: new Date().toISOString() },
			ip_address: Audit.getClientIp(req),
			user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
		})

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
		const parsedQuery = parseListQuery(req.query, transactionsListQuerySchema, transactionFilterValueSchemas)
		if (parsedQuery.error) return res.status(400).json({ errors: parsedQuery.error })
		if (parsedQuery.dateRangeError) return res.status(400).json({ code: 'INVALID_DATE_RANGE' })

		const { page, limit, filters } = parsedQuery
		const total = await User.countTransactionsByUser(req.user.id, filters)
		const totalPages = Math.max(1, Math.ceil(total / limit))
		if (page > totalPages) return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const txs = await User.findTransactionsByUser(req.user.id, page, limit, filters)
		res.json({ page, limit, totalPages, transactions: txs })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getSessions = async (req, res) => {
	try {
		const sessions = await Session.getSessionsByUserId(req.user.id)
		res.json({ sessions: sessions || [] })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const revokeSession = async (req, res) => {
	try {
		const { sessionId } = req.params

		const revoked = await Session.revokeSessionByUserId(req.user.id, sessionId)
		if (!revoked) return res.status(404).json({ code: 'SESSION_NOT_FOUND' })

		res.status(200).json({ code: 'SUCCESS' })
	} catch (err) {
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

		const deviceInfo = Audit.getUserAgentRaw(req)
		Audit.createAudit({
			user_id: userId,
			action: 'BALANCE_UPDATED',
			details: {
				type,
				amount,
				balance: newBalance,
				date: new Date().toISOString(),
			},
			ip_address: Audit.getClientIp(req),
			user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
		})

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
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const parsedQuery = parseListQuery(req.query, transactionsListQuerySchema, transactionFilterValueSchemas)
		if (parsedQuery.error) return res.status(400).json({ errors: parsedQuery.error })
		if (parsedQuery.dateRangeError) return res.status(400).json({ code: 'INVALID_DATE_RANGE' })

		const { page, limit, filters } = parsedQuery

		const user = await User.findUserById(id)
		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const total = await User.countTransactionsByUser(id, filters)
		const totalPages = Math.max(1, Math.ceil(total / limit))
		if (page > totalPages) return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const txs = await User.findTransactionsByUser(id, page, limit, filters)
		res.json({ page, limit, totalPages, transactions: txs })
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors })
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const getSessionsByUserId = async (req, res) => {
	try {
		const { id } = req.params
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const user = await User.findUserById(id)
		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const sessions = await Session.getSessionsByUserId(id)
		res.json({ sessions: sessions || [] })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

const revokeSessionByUserId = async (req, res) => {
	try {
		const { id, sessionId } = req.params
		if (!isValidUuid(id)) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const user = await User.findUserById(id)
		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const revoked = await Session.revokeSessionByUserId(id, sessionId)
		if (!revoked) return res.status(404).json({ code: 'SESSION_NOT_FOUND' })

		res.status(200).json({ code: 'SUCCESS' })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

export { getProfile, getAllUsers, deleteSelf, updateSelf, getUserById, updateUserById, deleteUserById, getSelfBalance, getTransactions, getSessions, revokeSession, createTransaction, getTransactionsByUserId, getSessionsByUserId, revokeSessionByUserId }
