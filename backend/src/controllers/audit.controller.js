import * as z from "zod"

import {
	AUDIT_FILTER_FIELDS,
	AUDIT_SELECTABLE_COLUMNS,
	AUDIT_TYPES,
	LEGACY_AUDIT_FILTERS,
	SORT_ORDERS,
} from "#config/admin-filters.config"
import Audit from "#services/audit.service"
import logger from "#utils/logger.utils"
import {
	createListQuerySchema,
	createStructuredFiltersSchema,
	csvEnumSchema,
	csvTextSchema,
	csvUuidSchema,
	optionalColumnsSchema,
	optionalEnumSchema,
} from "#utils/admin-query-validation.utils"

const auditColumnKeys = Object.freeze(Object.keys(AUDIT_SELECTABLE_COLUMNS))

const auditFilterValueSchemas = Object.freeze({
	id: csvUuidSchema(),
	userId: csvUuidSchema(),
	user_id: csvUuidSchema(),
	action: csvEnumSchema(AUDIT_TYPES),
	ip: csvTextSchema(),
	ipAddress: csvTextSchema(),
	ip_address: csvTextSchema(),
	userAgent: csvTextSchema(),
	user_agent: csvTextSchema(),
	details: csvTextSchema(),
	createdAt: csvTextSchema(),
	created_at: csvTextSchema(),
})

const auditQuerySchema = createListQuerySchema({
	filter: optionalEnumSchema(LEGACY_AUDIT_FILTERS),
	id: auditFilterValueSchemas.id.optional(),
	userId: auditFilterValueSchemas.userId.optional(),
	action: auditFilterValueSchemas.action.optional(),
	ip: auditFilterValueSchemas.ip.optional(),
	ipAddress: auditFilterValueSchemas.ipAddress.optional(),
	ip_address: auditFilterValueSchemas.ip_address.optional(),
	userAgent: auditFilterValueSchemas.userAgent.optional(),
	user_agent: auditFilterValueSchemas.user_agent.optional(),
	details: auditFilterValueSchemas.details.optional(),
	columns: optionalColumnsSchema(auditColumnKeys),
	sortBy: z.enum(auditColumnKeys).optional(),
	sortOrder: z.enum(SORT_ORDERS).optional(),
	filterField: z.enum(AUDIT_FILTER_FIELDS).optional(),
	filterBy: z.enum(AUDIT_FILTER_FIELDS).optional(),
	column: z.enum(AUDIT_FILTER_FIELDS).optional(),
	filterValue: z.unknown().optional(),
	filterValues: z.unknown().optional(),
	value: z.unknown().optional(),
	filters: createStructuredFiltersSchema(AUDIT_FILTER_FIELDS, auditFilterValueSchemas),
})

const getAuditLogs = async (req, res) => {
	const parsedQuery = auditQuerySchema.safeParse(req.query || {})
	if (!parsedQuery.success) {
		return res.status(400).json({ code: "INVALID_QUERY_PARAMS", errors: parsedQuery.error.issues })
	}

	const singleFilterField = parsedQuery.data.filterField ?? parsedQuery.data.filterBy ?? parsedQuery.data.column
	if (singleFilterField) {
		const singleFilterValue = parsedQuery.data.filterValues ?? parsedQuery.data.filterValue ?? parsedQuery.data.value
		const parseSingleFilter = auditFilterValueSchemas[singleFilterField]?.safeParse(singleFilterValue)

		if (!parseSingleFilter?.success) {
			return res.status(400).json({ code: "INVALID_QUERY_PARAMS", errors: parseSingleFilter?.error?.issues ?? [] })
		}
	}

	const page = parsedQuery.data.page ?? 1
	const limit = Math.min(parsedQuery.data.limit ?? 20, 100)

	if (parsedQuery.data.fromDate && parsedQuery.data.toDate) {
		const fromDate = new Date(parsedQuery.data.fromDate)
		const toDate = new Date(parsedQuery.data.toDate)

		if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime()) && fromDate > toDate) {
			return res.status(400).json({ code: "INVALID_DATE_RANGE" })
		}
	}

	const filters = { ...parsedQuery.data }
	delete filters.page
	delete filters.limit
	delete filters.filter

	try {
		const total = await Audit.countAuditLogs(filters)
		const totalPages = Math.max(1, Math.ceil(total / limit))

		if (page > totalPages) {
			return res.status(400).json({ code: "PAGE_EXCEDED" })
		}

		const logs = await Audit.getAuditLogs(page, limit, filters)

		res.json({
			page,
			limit,
			totalPages,
			logs: logs || [],
		})
	} catch (err) {
		logger.error(err)
		res.status(500).json({ code: "SERVER_ERROR" })
	}
}

export default getAuditLogs
