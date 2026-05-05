import Audit from '#services/audit.service'
import * as z from 'zod'
import logger from '#utils/logger'

const getAuditLogs = async (req, res) => {
	const querySchema = z.object({
		page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
		limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
	})

	const query = querySchema.safeParse(req.query ?? {})
	if (!query.success) {
		return res.status(400).json({ code: 'INVALID_QUERY_PARAMS', errors: query.error.errors })
	}

	const page = query.data.page ?? 1
	const limit = query.data.limit ?? 20

	try {
		const total = await Audit.countAuditLogs()
		const totalPages = Math.max(1, Math.ceil(total / limit))
		if (page > totalPages) return res.status(400).json({ code: 'PAGE_EXCEDED' })

		const logs = await Audit.getAuditLogs(page, limit)
		res.json({ page, limit, totalPages, logs: logs || [] })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: 'SERVER_ERROR' })
	}
}

export default getAuditLogs
