import AuditService from "#services/audit"
import * as z from 'zod'
import logger from "#utils/logger"

const getAuditLogs = async (req, res) => {
	const querySchema = z.object({
		page: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
		limit: z.preprocess((v) => parseInt(v, 10), z.number().int().positive()).optional(),
	})

	const query = querySchema.safeParse(req.query ?? {})
	if (!query.success) {
		return res.status(400).json({ code: "INVALID_QUERY_PARAMS", errors: query.error.errors })
	}

	const page = query.data.page ?? 1
	const limit = query.data.limit ?? 20

	try {
		const logs = await AuditService.getAuditLogs(page, limit)
		res.json(logs || [])
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: "SERVER_ERROR" })
	}
}

export default getAuditLogs
