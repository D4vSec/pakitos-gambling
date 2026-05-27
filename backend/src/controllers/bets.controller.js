import * as z from "zod"
import Bets from "#models/bets.model"
import BetService from "#services/bets.service"
import Audit from "#services/audit.service"
import {
    createListQuerySchema,
    createStructuredFiltersSchema,
    csvEnumSchema,
    csvNumberSchema,
    csvTextSchema,
    csvUuidSchema,
    toOptionalNumber,
    validateDateInput,
} from "#utils/admin-query-validation.utils"
import { isValidUuid } from "#utils/admin-query.utils"
import logger from "#utils/logger.utils"

const SORT_ORDERS = Object.freeze(["asc", "desc", "none"])
const BET_FILTER_FIELDS = Object.freeze(["name", "label", "status", "optionsCount", "options_count", "options"])
const BET_SORT_FIELDS = Object.freeze(["name", "label", "status", "endsAt", "ends_at", "createdAt", "created_at", "optionsCount", "options_count", "options"])
const BET_STATUSES = Object.freeze(["open", "closed"])

const betFilterValueSchemas = Object.freeze({
    name: csvTextSchema(),
    label: csvTextSchema(),
    status: csvEnumSchema(BET_STATUSES),
    optionsCount: csvNumberSchema(),
    options_count: csvNumberSchema(),
    options: csvNumberSchema(),
})

const betsListQuerySchema = createListQuerySchema({
    name: betFilterValueSchemas.name.optional(),
    label: betFilterValueSchemas.label.optional(),
    status: betFilterValueSchemas.status.optional(),
    optionsCount: betFilterValueSchemas.optionsCount.optional(),
    options_count: betFilterValueSchemas.options_count.optional(),
    options: betFilterValueSchemas.options.optional(),
    fromEndsAt: z.string().refine(validateDateInput, { message: "INVALID_FROM_ENDS_AT" }).optional(),
    toEndsAt: z.string().refine(validateDateInput, { message: "INVALID_TO_ENDS_AT" }).optional(),
    fromCreatedAt: z.string().refine(validateDateInput, { message: "INVALID_FROM_CREATED_AT" }).optional(),
    toCreatedAt: z.string().refine(validateDateInput, { message: "INVALID_TO_CREATED_AT" }).optional(),
    sortBy: z.enum(BET_SORT_FIELDS).optional(),
    sortOrder: z.enum(SORT_ORDERS).optional(),
    filterField: z.enum(BET_FILTER_FIELDS).optional(),
    filterBy: z.enum(BET_FILTER_FIELDS).optional(),
    column: z.enum(BET_FILTER_FIELDS).optional(),
    filterValue: z.unknown().optional(),
    filterValues: z.unknown().optional(),
    value: z.unknown().optional(),
    filters: createStructuredFiltersSchema(BET_FILTER_FIELDS, betFilterValueSchemas),
})

const betOptionSchema = z.object({
    label: z.string().trim().min(1).max(120),
    odd: z.preprocess((value) => toOptionalNumber(value), z.number().min(1.01)),
})

const createBetSchema = z.object({
    label: z.string().trim().min(3).max(120).optional(),
    name: z.string().trim().min(3).max(120).optional(),
    ends_at: z.string().refine(validateDateInput, { message: "INVALID_ENDS_AT" }),
    options: z.array(betOptionSchema).min(2).max(20),
}).strict()
    .superRefine((value, ctx) => {
        if (!(value.label || value.name)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "BET_LABEL_REQUIRED",
                path: ["label"],
            })
        }
    })

const updateBetSchema = z.object({
    label: z.string().trim().min(3).max(120).optional(),
    name: z.string().trim().min(3).max(120).optional(),
    ends_at: z.string().refine(validateDateInput, { message: "INVALID_ENDS_AT" }).optional(),
    options: z.array(betOptionSchema).min(2).max(20).optional(),
}).strict()
    .superRefine((value, ctx) => {
        if (
            value.label === undefined
            && value.name === undefined
            && value.ends_at === undefined
            && value.options === undefined
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "BET_UPDATE_REQUIRED",
                path: ["label"],
            })
        }
    })

const settlementPreviewSchema = z.object({
    winningOptionId: csvUuidSchema(),
}).strict()

const settlementResultSchema = settlementPreviewSchema

const parseBetListQuery = (query = {}) => {
    const parsedQuery = betsListQuerySchema.safeParse(query)
    if (!parsedQuery.success) {
        return { error: parsedQuery.error.issues }
    }

    const singleFilterField = parsedQuery.data.filterField ?? parsedQuery.data.filterBy ?? parsedQuery.data.column
    if (singleFilterField) {
        const singleFilterValue = parsedQuery.data.filterValues ?? parsedQuery.data.filterValue ?? parsedQuery.data.value
        const singleFilterSchema = betFilterValueSchemas[singleFilterField]
        const parseSingleFilter = singleFilterSchema?.safeParse(singleFilterValue)

        if (!parseSingleFilter?.success) {
            return { error: parseSingleFilter?.error?.issues ?? [{ message: "INVALID_FILTER_VALUE" }] }
        }
    }

    const dateRanges = [
        [parsedQuery.data.fromEndsAt, parsedQuery.data.toEndsAt],
        [parsedQuery.data.fromCreatedAt, parsedQuery.data.toCreatedAt],
    ]
    const hasInvalidDateRange = dateRanges.some(([fromDateValue, toDateValue]) => {
        if (!fromDateValue || !toDateValue) return false

        const fromDate = new Date(fromDateValue)
        const toDate = new Date(toDateValue)

        return !Number.isNaN(fromDate.getTime())
            && !Number.isNaN(toDate.getTime())
            && fromDate > toDate
    })

    if (hasInvalidDateRange) {
        return { error: [{ message: "INVALID_DATE_RANGE" }] }
    }

    const filters = { ...parsedQuery.data }
    delete filters.page
    delete filters.limit

    return {
        page: parsedQuery.data.page ?? 1,
        limit: Math.min(parsedQuery.data.limit ?? 20, 100),
        filters,
    }
}

const getBetLabel = (data = {}) => data.label ?? data.name

const createAdminAudit = (req, details) => {
    const deviceInfo = Audit.getUserAgentRaw(req)
    Audit.createAudit({
        user_id: req.user.id,
        action: "ADMIN_ACTION",
        details: {
            ...details,
            date: new Date().toISOString(),
        },
        ip_address: Audit.getClientIp(req),
        user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
    })
}

const getBets = async (req, res) => {
    try {
        const parsedQuery = parseBetListQuery(req.query)
        if (parsedQuery.error) {
            return res.status(400).json({ errors: parsedQuery.error })
        }

        const bets = await BetService.getBetsForUser(req.user.id, parsedQuery.page, parsedQuery.limit, parsedQuery.filters)
        res.status(200).json(bets)
    } catch (error) {
        logger.error({ message: "Error loading bets:", error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const getAdminBets = async (req, res) => {
    try {
        const parsedQuery = parseBetListQuery(req.query)
        if (parsedQuery.error) {
            return res.status(400).json({ code: "INVALID_QUERY_PARAMS", errors: parsedQuery.error })
        }

        const { page, limit, filters } = parsedQuery
        const total = await BetService.countBets(filters)
        const totalPages = Math.max(1, Math.ceil(total / limit))
        if (page > totalPages) return res.status(400).json({ code: "PAGE_EXCEDED" })

        const bets = await BetService.getBets(page, limit, filters)
        res.status(200).json({ page, limit, totalPages, bets: bets || [] })
    } catch (error) {
        logger.error({ message: "Error loading admin bets:", error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const getAdminBet = async (req, res) => {
    const { betId } = req.params

    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const bet = await BetService.getAdminBet(betId)
        if (!bet) return res.status(404).json({ code: "BET_NOT_FOUND" })

        res.status(200).json(bet)
    } catch (error) {
        logger.error({ message: `Error loading admin bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const getBetInfo = async (req, res) => {
    const { betId } = req.params
    try {
        const betInfo = await Bets.getBetInfo(betId)
        res.status(200).json(betInfo)
    } catch (error) {
        logger.error({ message: `Error loading bet info for bet ${betId}:`, error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const createBet = async (req, res) => {
    try {
        const parsedBody = createBetSchema.safeParse(req.body || {})
        if (!parsedBody.success) {
            return res.status(400).json({ code: "INVALID_BET_DATA", errors: parsedBody.error.issues })
        }

        const createdBet = await BetService.createBet({
            label: getBetLabel(parsedBody.data),
            ends_at: parsedBody.data.ends_at,
            options: parsedBody.data.options,
        })

        createAdminAudit(req, {
            type: "BET_CREATED",
            betId: createdBet.id,
            optionCount: createdBet.options?.length ?? 0,
        })

        res.status(201).json(createdBet)
    } catch (error) {
        logger.error({ message: "Error creating bet:", error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const deleteBet = async (req, res) => {
    const { betId } = req.params
    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const hasActivity = await BetService.hasBetActivity(betId)
        if (hasActivity) {
            return res.status(409).json({ code: "BET_HAS_ACTIVITY" })
        }

        const deleted = await BetService.deleteBet(betId)
        if (!deleted) return res.status(404).json({ code: "BET_NOT_FOUND" })

        createAdminAudit(req, {
            type: "BET_DELETED",
            betId,
        })

        res.status(200).json({ code: "SUCCESS" })
    } catch (error) {
        logger.error({ message: `Error deleting bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const updateBet = async (req, res) => {
    const { betId } = req.params
    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const parsedBody = updateBetSchema.safeParse(req.body || {})
        if (!parsedBody.success) {
            return res.status(400).json({ code: "INVALID_BET_DATA", errors: parsedBody.error.issues })
        }

        if (parsedBody.data.options) {
            const hasActivity = await BetService.hasBetActivity(betId)
            if (hasActivity) {
                return res.status(409).json({ code: "BET_HAS_ACTIVITY" })
            }
        }

        const updatedBet = await BetService.updateBet(betId, {
            label: getBetLabel(parsedBody.data),
            ends_at: parsedBody.data.ends_at,
            options: parsedBody.data.options,
        })
        if (!updatedBet) return res.status(404).json({ code: "BET_NOT_FOUND" })

        createAdminAudit(req, {
            type: "BET_UPDATED",
            betId,
            changes: Object.keys(parsedBody.data),
        })

        res.status(200).json({ code: "SUCCESS" })
    } catch (error) {
        logger.error({ message: `Error updating bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const closeBet = async (req, res) => {
    const { betId } = req.params

    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const closedBet = await BetService.closeBet(betId)
        if (!closedBet) return res.status(404).json({ code: "BET_NOT_FOUND" })

        createAdminAudit(req, {
            type: "BET_CLOSED_BY_ADMIN",
            betId,
        })

        res.status(200).json({ code: "SUCCESS" })
    } catch (error) {
        logger.error({ message: `Error closing bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const getSettlementPreview = async (req, res) => {
    const { betId } = req.params

    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const parsedBody = settlementPreviewSchema.safeParse(req.body || {})
        if (!parsedBody.success) {
            return res.status(400).json({ code: "INVALID_BET_DATA", errors: parsedBody.error.issues })
        }

        const winningOptionId = parsedBody.data.winningOptionId[0]
        const preview = await BetService.getSettlementPreview(betId, winningOptionId)
        if (!preview) return res.status(404).json({ code: "OPTION_NOT_FOUND" })

        res.status(200).json(preview)
    } catch (error) {
        logger.error({ message: `Error generating settlement preview for bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const settleBet = async (req, res) => {
    const { betId } = req.params

    try {
        if (!isValidUuid(betId)) return res.status(404).json({ code: "BET_NOT_FOUND" })

        const parsedBody = settlementResultSchema.safeParse(req.body || {})
        if (!parsedBody.success) {
            return res.status(400).json({ code: "INVALID_BET_DATA", errors: parsedBody.error.issues })
        }

        const deviceInfo = Audit.getUserAgentRaw(req)
        const winningOptionId = parsedBody.data.winningOptionId[0]
        const settlement = await BetService.settleBet(betId, winningOptionId, {
            adminUserId: req.user.id,
            ipAddress: Audit.getClientIp(req),
            userAgent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
        })

        if (!settlement) return res.status(404).json({ code: "BET_NOT_FOUND" })
        if (settlement.code === "BET_NOT_FOUND") return res.status(404).json({ code: "BET_NOT_FOUND" })
        if (settlement.code === "OPTION_NOT_FOUND") return res.status(404).json({ code: "OPTION_NOT_FOUND" })
        if (settlement.code === "BET_ALREADY_SETTLED") {
            return res.status(409).json({ code: "BET_ALREADY_SETTLED", settlement: settlement.settlement })
        }

        res.status(200).json(settlement)
    } catch (error) {
        logger.error({ message: `Error settling bet ${betId}:`, error })
        res.status(500).json({ code: "SERVER_ERROR" })
    }
}

const placeBet = async (req, res) => {
    const { betId } = req.params
    const { betOptionId } = req.body
    const { amount } = req.body
    const userId = req.user.id

    try {
        const numericAmount = Number(amount)
        if (!isValidUuid(betId)) {
            return res.status(404).json({ code: "BET_NOT_FOUND" })
        }

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
        }

        const userBet = await BetService.placeBet(userId, betId, betOptionId, numericAmount)
        if (userBet.code === "BET_NOT_FOUND") {
            return res.status(404).json({ code: "BET_NOT_FOUND" })
        }
        if (userBet.code === "USER_NOT_FOUND") {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        if (userBet.code === "OPTION_NOT_FOUND") {
            return res.status(404).json({ code: "OPTION_NOT_FOUND" })
        }
        if (userBet.code === "INVALID_BET_AMOUNT") {
            return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
        }
        if (userBet.code === "BET_CLOSED") {
            return res.status(400).json({ code: "BET_CLOSED" })
        }
        if (userBet.code === "INSUFFICIENT_FUNDS") {
            return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
        }
        if (userBet.code === "BET_ALREADY_PLACED_ON_MARKET") {
            return res.status(409).json(userBet)
        }

        try {
            await BetService.updateOddsForBet(betId)
        } catch (oddsError) {
            logger.error({
                message: `Bet ${userBet?.id ?? "unknown"} placed but odds update failed for bet ${betId}:`,
                error: oddsError,
            })
        }

        const deviceInfo = Audit.getUserAgentRaw(req)
        Audit.createAudit({
            user_id: userId,
            action: "BET_PLACED",
            details: {
                betId,
                betOptionId,
                optionLabel: userBet.option_label,
                amount: numericAmount,
                date: new Date().toISOString(),
            },
            ip_address: Audit.getClientIp(req),
            user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
        })

        res.status(201).json(userBet)
    } catch (error) {
        logger.error({ message: `Error placing bet on option ${betOptionId}:`, error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export {
    closeBet,
    createBet,
    deleteBet,
    getAdminBet,
    getAdminBets,
    getBets,
    getBetInfo,
    getSettlementPreview,
    settleBet,
    placeBet,
    updateBet,
}
