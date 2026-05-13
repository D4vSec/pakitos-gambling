import { describe, expect, it } from 'vitest'

import { getSelectedColumns, getSortClause, normalizeList, pushContainsClause } from '../../../src/utils/admin-query.utils.js'

describe('admin query utils', () => {
	it('ignores inherited properties when selecting columns', () => {
		const allowedColumns = Object.freeze({
			id: 'id',
			created_at: 'created_at',
		})

		expect(getSelectedColumns(['__proto__', 'id'], allowedColumns, ['id'])).toEqual(['id'])
		expect(getSelectedColumns('constructor', allowedColumns, ['id'])).toEqual(['id'])
	})

	it('ignores inherited properties when building sort clauses', () => {
		const allowedColumns = Object.freeze({
			id: 'id',
			created_at: 'created_at',
		})

		expect(
			getSortClause({
				sortBy: '__proto__',
				sortOrder: 'asc',
				allowedColumns,
				defaultSort: 'ORDER BY created_at DESC',
			}),
		).toBe('ORDER BY created_at DESC')
	})

	it('escapes LIKE metacharacters in contains clauses', () => {
		const clauses = []
		const values = []

		pushContainsClause(clauses, values, 'details::text', ['100%_test\\value'])

		expect(clauses).toEqual(["(details::text ILIKE $1 ESCAPE '\\')"])
		expect(values).toEqual(['%100\\%\\_test\\\\value%'])
	})

	it('parses JSON array strings for multi-value filters', () => {
		expect(normalizeList('["BET","WIN"]')).toEqual(['BET', 'WIN'])
		expect(normalizeList('["id","action"]')).toEqual(['id', 'action'])
	})
})
