const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const LIKE_META_REGEX = /[\\%_]/g

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
const escapeLikePattern = (value) => value.replace(LIKE_META_REGEX, "\\$&")
const tryParseJson = (value) => {
	try {
		return JSON.parse(value)
	} catch {
		return value
	}
}

const normalizeList = (value) => {
	if (value === undefined || value === null) return []
	if (Array.isArray(value)) return value.flatMap((item) => normalizeList(item))
	if (typeof value !== "string") return [String(value)]

	const trimmedValue = value.trim()
	if (!trimmedValue) return []

	if (trimmedValue.startsWith("[") || trimmedValue.startsWith('"')) {
		const parsedValue = tryParseJson(trimmedValue)
		if (parsedValue !== value) return normalizeList(parsedValue)
	}

	return [trimmedValue]
}

const normalizeDate = (value, boundary = "start") => {
	if (!value) return null
	if (typeof value !== "string") return null

	if (DATE_ONLY_REGEX.test(value)) {
		return boundary === "end" ? `${value} 23:59:59.999` : `${value} 00:00:00.000`
	}

	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) return null

	return parsed.toISOString()
}

const isValidUuid = (value) => typeof value === "string" && UUID_REGEX.test(value.trim())

const getSelectedColumns = (requestedColumns, allowedColumns, defaultColumns) => {
	const selectedKeys = normalizeList(requestedColumns)
	const selectedColumns = selectedKeys.map((key) => (hasOwn(allowedColumns, key) ? allowedColumns[key] : null)).filter(Boolean)

	if (selectedColumns.length > 0) return [...new Set(selectedColumns)]

	return defaultColumns.map((key) => (hasOwn(allowedColumns, key) ? allowedColumns[key] : null)).filter(Boolean)
}

const getSortClause = ({ sortBy, sortOrder, allowedColumns, defaultSort }) => {
	const normalizedOrder = typeof sortOrder === "string" ? sortOrder.trim().toLowerCase() : ""

	if (normalizedOrder === "none") return ""

	const sortColumn = hasOwn(allowedColumns, sortBy) ? allowedColumns[sortBy] : null
	if (!sortColumn) return defaultSort

	if (normalizedOrder === "desc") return `ORDER BY ${sortColumn} DESC`

	return `ORDER BY ${sortColumn} ASC`
}

const parseStructuredFilters = (rawFilters) => {
	if (!rawFilters) return []

	let parsedFilters = rawFilters
	if (typeof rawFilters === "string") {
		try {
			parsedFilters = JSON.parse(rawFilters)
		} catch {
			return []
		}
	}

	const items = Array.isArray(parsedFilters) ? parsedFilters : [parsedFilters]

	return items.flatMap((item) => {
		if (!isPlainObject(item)) return []

		const field = item.field ?? item.column ?? item.key
		if (typeof field !== "string" || field.trim().length === 0) return []

		const values = normalizeList(item.values ?? item.value)
		if (values.length === 0) return []

		return [{ field: field.trim(), values }]
	})
}

const getFilterGroups = (rawFilters = {}) => {
	const filters = [...parseStructuredFilters(rawFilters.filters)]
	const field = rawFilters.filterField ?? rawFilters.filterBy ?? rawFilters.column
	const values = normalizeList(rawFilters.filterValues ?? rawFilters.filterValue ?? rawFilters.value)

	if (typeof field === "string" && field.trim().length > 0 && values.length > 0) {
		filters.push({ field: field.trim(), values })
	}

	return filters
}

const pushInClause = (clauses, values, column, rawValues, cast = "") => {
	const placeholders = rawValues.map((value) => {
		values.push(value)
		return `$${values.length}${cast}`
	})

	if (placeholders.length === 1) {
		clauses.push(`${column} = ${placeholders[0]}`)
		return
	}

	clauses.push(`${column} IN (${placeholders.join(", ")})`)
}

const pushContainsClause = (clauses, values, column, rawValues) => {
	const placeholders = rawValues.map((value) => {
		values.push(`%${escapeLikePattern(value)}%`)
		return `${column} ILIKE $${values.length} ESCAPE '\\'`
	})

	if (placeholders.length === 0) return

	clauses.push(`(${placeholders.join(" OR ")})`)
}

export {
	getFilterGroups,
	getSelectedColumns,
	getSortClause,
	isValidUuid,
	normalizeDate,
	normalizeList,
	pushContainsClause,
	pushInClause,
}
