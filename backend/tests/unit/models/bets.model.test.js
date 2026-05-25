import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#config/db.config', () => ({
	default: {
		getClient: vi.fn(),
		query: vi.fn(),
	},
}))

import db from '#config/db.config'
import betsModel from '../../../src/models/bets.model.js'

describe('bets model', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('supports filtering bets by name and status with sorting and pagination', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Champions League', status: 'open' }] })

		await expect(
			betsModel.findBets(2, 10, {
				name: ['Champions'],
				status: ['open'],
				filterField: 'label',
				filterValue: 'League',
				sortBy: 'endsAt',
				sortOrder: 'desc',
			}),
		).resolves.toEqual([{ id: 'bet-1', label: 'Champions League', status: 'open' }])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id WHERE (bets.label ILIKE $1 ESCAPE '\\') AND (bets.ends_at >= CURRENT_TIMESTAMP) AND (bets.label ILIKE $2 ESCAPE '\\') GROUP BY bets.id ORDER BY bets.ends_at DESC LIMIT $3 OFFSET $4",
			['%Champions%', '%League%', 10, 10],
		)
	})

	it('returns no bets for invalid status filters without touching typed comparisons', async () => {
		db.query.mockResolvedValueOnce({ rows: [] })

		await expect(betsModel.findBets(1, 20, { status: ['invalid'] })).resolves.toEqual([])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id WHERE 1 = 0 GROUP BY bets.id ORDER BY bets.ends_at ASC LIMIT $1 OFFSET $2",
			[20, 0],
		)
	})

	it('counts bets with the existing filters', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 3 }] })

		await expect(betsModel.countBets({ status: 'open', name: 'Champions' })).resolves.toBe(3)

		expect(db.query).toHaveBeenCalledWith(
			"SELECT COUNT(*)::int AS count FROM bets WHERE (bets.label ILIKE $1 ESCAPE '\\') AND (bets.ends_at >= CURRENT_TIMESTAMP)",
			['%Champions%'],
		)
	})

	it('creates bets with options using a transaction', async () => {
		const client = {
			query: vi
				.fn()
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', ends_at: '2026-06-01T18:00:00.000Z' }] })
				.mockResolvedValueOnce({ rows: [{ id: 'opt-1', label: 'A', odd: 2.1 }] })
				.mockResolvedValueOnce({ rows: [{ id: 'opt-2', label: 'B', odd: 1.8 }] })
				.mockResolvedValueOnce(undefined),
			release: vi.fn(),
		}
		db.getClient.mockResolvedValueOnce(client)

		await expect(
			betsModel.createBetWithOptions({
				label: 'Final',
				ends_at: '2026-06-01T18:00:00.000Z',
				options: [
					{ label: 'A', odd: 2.1 },
					{ label: 'B', odd: 1.8 },
				],
			}),
		).resolves.toEqual({
			id: 'bet-1',
			label: 'Final',
			ends_at: '2026-06-01T18:00:00.000Z',
			options: [
				{ id: 'opt-1', label: 'A', odd: 2.1 },
				{ id: 'opt-2', label: 'B', odd: 1.8 },
			],
		})

		expect(client.query).toHaveBeenCalledWith('BEGIN')
		expect(client.query).toHaveBeenCalledWith('COMMIT')
		expect(client.release).toHaveBeenCalled()
	})
})
