import Audit from '#services/audit.service'
import * as z from 'zod'
import logger from '#utils/logger.utils'
import { AUDIT_TYPES } from '#@/config/audit.config'

const VALID_ACTION_PARAMS = Object.freeze({
	"userId": ["userId"],
	"action": ["action"],
	"date": ["fromDate", "toDate"],
})

const getAuditLogs = async (req, res) => {
	const queryData = req.query || {}

	const querySchema = z.object({
		page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
		limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
		filter: z.string().optional(),
		fromDate: z.string().refine((date) => !date || !isNaN(Date.parse(date)), { message: 'INVALID_FROM_DATE' }).optional(),
		toDate: z.string().refine((date) => !date || !isNaN(Date.parse(date)), { message: 'INVALID_TO_DATE' }).optional(),
		userId: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
		action: z.enum(AUDIT_TYPES).optional()
	})

	if (queryData.filter) {
		const filterKey = queryData.filter
		if (!VALID_ACTION_PARAMS[filterKey])
			return res.status(400).json({ code: 'INVALID_FILTER_KEY', expected: VALID_ACTION_PARAMS })

		const missingParams = VALID_ACTION_PARAMS[filterKey].filter(param => !(param in queryData))

		if (missingParams.length > 0)
			return res.status(400).json({ code: 'MISSING_FILTER_PARAMS', missingParams })
	}

	const query = querySchema.safeParse(queryData)
	if (!query.success)
		return res.status(400).json({ code: 'INVALID_QUERY_PARAMS', errors: query.error.errors })

	const page = query.data.page ?? 1
	const limit = Math.min(query.data.limit ?? 20, 100)
	const filters = {}

	if (query.data.userId) filters.userId = query.data.userId
	if (query.data.action) filters.action = query.data.action
	if (query.data.fromDate) filters.fromDate = query.data.fromDate
	if (query.data.toDate) filters.toDate = query.data.toDate

	try {
		const total = await Audit.countAuditLogs(filters)
		const totalPages = Math.max(1, Math.ceil(total / limit))

		if (page > totalPages)
			return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const logs = await Audit.getAuditLogs(page, limit, filters)

		res.json({
			page,
			limit,
			totalPages,
			logs: logs || []
		})

	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

export default getAuditLogs
