import * as z from "zod"

import { isValidUuid, normalizeList } from "#utils/admin-query.utils"

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MAX_FILTER_VALUES = 20
const MAX_FILTER_LENGTH = 120

const toOptionalNumber = (value) => {
	if (value === undefined || value === null || value === "") return undefined

	const numericValue = Number(value)
	return Number.isFinite(numericValue) ? numericValue : value
}

const normalizeCsvValue = (value) => {
	const normalized = normalizeList(value)
	return normalized.length > 0 ? normalized : undefined
}

const validateDateInput = (value) => {
	if (!value) return true
	if (typeof value !== "string") return false

	const parsed = new Date(value)
	return !Number.isNaN(parsed.getTime()) || DATE_ONLY_REGEX.test(value)
}

const csvUuidSchema = () =>
	z.preprocess(
		normalizeCsvValue,
		z.array(z.string().trim().refine(isValidUuid, { message: "INVALID_UUID" })).min(1).max(MAX_FILTER_VALUES),
	)

const csvEnumSchema = (values) =>
	z.preprocess(
		normalizeCsvValue,
		z.array(z.enum(values)).min(1).max(MAX_FILTER_VALUES),
	)

const csvTextSchema = (maxLength = MAX_FILTER_LENGTH) =>
	z.preprocess(
		normalizeCsvValue,
		z.array(z.string().trim().min(1).max(maxLength)).min(1).max(MAX_FILTER_VALUES),
	)

const csvNumberSchema = () =>
	z.preprocess(
		normalizeCsvValue,
		z.array(z.preprocess((value) => toOptionalNumber(value), z.number().finite())).min(1).max(MAX_FILTER_VALUES),
	)

const optionalEnumSchema = (values) => z.enum(values).optional()

const optionalColumnsSchema = (values) => csvEnumSchema(values).optional()

const parseStructuredFilters = (rawFilters) => {
	if (rawFilters === undefined || rawFilters === null || rawFilters === "") return undefined

	if (typeof rawFilters === "string") {
		try {
			return JSON.parse(rawFilters)
		} catch {
			return rawFilters
		}
	}

	return rawFilters
}

const createStructuredFiltersSchema = (allowedFields, fieldValueSchemas) =>
	z
		.preprocess(
			parseStructuredFilters,
			z.union([
				z.object({
					field: z.enum(allowedFields).optional(),
					column: z.enum(allowedFields).optional(),
					key: z.enum(allowedFields).optional(),
					value: z.unknown().optional(),
					values: z.unknown().optional(),
				}),
				z.array(
					z.object({
						field: z.enum(allowedFields).optional(),
						column: z.enum(allowedFields).optional(),
						key: z.enum(allowedFields).optional(),
						value: z.unknown().optional(),
						values: z.unknown().optional(),
					}),
				).max(MAX_FILTER_VALUES),
			]),
		)
		.superRefine((value, ctx) => {
			const items = Array.isArray(value) ? value : [value]

			items.forEach((item, index) => {
				const field = item.field ?? item.column ?? item.key
				if (!field) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "FILTER_FIELD_REQUIRED",
						path: [index, "field"],
					})
					return
				}

				const schema = fieldValueSchemas[field]
				if (!schema) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "INVALID_FILTER_FIELD",
						path: [index, "field"],
					})
					return
				}

				const parseResult = schema.safeParse(item.values ?? item.value)
				if (!parseResult.success) {
					parseResult.error.issues.forEach((issue) => {
						ctx.addIssue({
							...issue,
							path: [index, ...(issue.path ?? [])],
						})
					})
				}
			})
		})
		.transform((value) => (Array.isArray(value) ? value : [value]))
		.optional()

const createListQuerySchema = (shape) =>
	z
		.object({
			page: z.preprocess((value) => toOptionalNumber(value), z.number().int().positive()).optional(),
			limit: z.preprocess((value) => toOptionalNumber(value), z.number().int().positive().max(100)).optional(),
			fromDate: z.string().refine(validateDateInput, { message: "INVALID_FROM_DATE" }).optional(),
			toDate: z.string().refine(validateDateInput, { message: "INVALID_TO_DATE" }).optional(),
			...shape,
		})
		.strict()

export {
	createListQuerySchema,
	createStructuredFiltersSchema,
	csvEnumSchema,
	csvNumberSchema,
	csvTextSchema,
	csvUuidSchema,
	optionalColumnsSchema,
	optionalEnumSchema,
	toOptionalNumber,
	validateDateInput,
}
