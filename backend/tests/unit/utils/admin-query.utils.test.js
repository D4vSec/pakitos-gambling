import { describe, expect, it } from 'vitest'

import {
	getFilterGroups,
	getSelectedColumns,
	getSortClause,
	isValidUuid,
	normalizeDate,
	normalizeList,
	pushContainsClause,
	pushInClause,
} from '../../../src/utils/admin-query.utils.js'

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

	it('normalizes date boundaries', () => {
		expect(normalizeDate('2026-05-13', 'start')).toBe('2026-05-13T00:00:00.000Z')
		expect(normalizeDate('2026-05-13', 'end')).toBe('2026-05-13T23:59:59.999Z')
		expect(normalizeDate('not-a-date')).toBeNull()
	})

	it('parses structured filters and fallback filter groups', () => {
		expect(
			getFilterGroups({
				filters: JSON.stringify([{ field: 'action', values: ['LOGIN'] }]),
				filterField: 'userId',
				filterValue: '11111111-1111-1111-1111-111111111111',
			}),
		).toEqual([
			{ field: 'action', values: ['LOGIN'] },
			{ field: 'userId', values: ['11111111-1111-1111-1111-111111111111'] },
		])
	})

	it('builds IN clauses for single and multi-value sets', () => {
		const clauses = []
		const values = []

		pushInClause(clauses, values, 'action', ['LOGIN'])
		pushInClause(clauses, values, 'role', ['admin', 'user'])

		expect(clauses).toEqual(['action = $1', 'role IN ($2, $3)'])
		expect(values).toEqual(['LOGIN', 'admin', 'user'])
	})

	it('validates UUID strings', () => {
		expect(isValidUuid('11111111-1111-1111-1111-111111111111')).toBe(true)
		expect(isValidUuid('bad-id')).toBe(false)
	})
})
