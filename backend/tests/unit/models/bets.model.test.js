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

	it('supports filtering bets by closing and created date ranges', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', status: 'open' }] })

		await expect(
			betsModel.findBets(1, 20, {
				fromEndsAt: '2026-06-01',
				toEndsAt: '2026-06-30',
				fromCreatedAt: '2026-05-01',
				toCreatedAt: '2026-05-31',
				sortBy: 'createdAt',
				sortOrder: 'desc',
			}),
		).resolves.toEqual([{ id: 'bet-1', label: 'Final', status: 'open' }])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id WHERE bets.ends_at >= $1 AND bets.ends_at <= $2 AND bets.created_at >= $3 AND bets.created_at <= $4 GROUP BY bets.id ORDER BY bets.created_at DESC LIMIT $5 OFFSET $6",
			[
				'2026-06-01 00:00:00.000',
				'2026-06-30 23:59:59.999',
				'2026-05-01 00:00:00.000',
				'2026-05-31 23:59:59.999',
				20,
				0,
			],
		)
	})

	it('supports filtering bets by options count', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', status: 'open' }] })

		await expect(
			betsModel.findBets(1, 20, {
				optionsCount: [2],
				sortBy: 'endsAt',
				sortOrder: 'asc',
			}),
		).resolves.toEqual([{ id: 'bet-1', label: 'Final', status: 'open' }])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id WHERE (SELECT COUNT(*) FROM bets_options WHERE bets_options.bet_id = bets.id) = $1 GROUP BY bets.id ORDER BY bets.ends_at ASC LIMIT $2 OFFSET $3",
			[2, 20, 0],
		)
	})

	it('supports sorting bets by options count', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', status: 'open' }] })

		await expect(
			betsModel.findBets(1, 20, {
				sortBy: 'optionsCount',
				sortOrder: 'desc',
			}),
		).resolves.toEqual([{ id: 'bet-1', label: 'Final', status: 'open' }])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT bets.*, CASE WHEN bets.ends_at < CURRENT_TIMESTAMP THEN 'closed' ELSE 'open' END AS status, COALESCE(json_agg(json_build_object('id', bets_options.id, 'label', bets_options.label, 'odd', bets_options.odd) ORDER BY bets_options.id) FILTER (WHERE bets_options.id IS NOT NULL), '[]'::json) AS options FROM bets LEFT JOIN bets_options ON bets.id = bets_options.bet_id  GROUP BY bets.id ORDER BY COUNT(bets_options.id) DESC LIMIT $1 OFFSET $2",
			[20, 0],
		)
	})

	it('loads the user bet selections for the listed markets', async () => {
		db.query.mockResolvedValueOnce({
			rows: [{
				id: 'user-bet-1',
				amount: '100',
				odd: '1.8',
				bet_option_id: 'opt-1',
				bet_id: '11111111-1111-1111-1111-111111111111',
				option_label: 'Madrid',
			}],
		})

		await expect(
			betsModel.getUserBetSelections(
				'22222222-2222-2222-2222-222222222222',
				['11111111-1111-1111-1111-111111111111'],
			),
			).resolves.toEqual([{
				id: 'user-bet-1',
				amount: '100',
				odd: '1.8',
				bet_option_id: 'opt-1',
				bet_id: '11111111-1111-1111-1111-111111111111',
				option_label: 'Madrid',
			}])

		expect(db.query).toHaveBeenCalledWith(
			`
        SELECT
            ub.id,
            ub.amount,
            ub.odd,
            ub.bet_option_id,
            bo.bet_id,
            bo.label AS option_label
        FROM user_bets ub
        INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
        WHERE ub.user_id = $1 AND bo.bet_id = ANY($2::uuid[])
    `,
			['22222222-2222-2222-2222-222222222222', ['11111111-1111-1111-1111-111111111111']],
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

	it('places a bet once per market and returns the selected option label', async () => {
		const client = {
			query: vi
				.fn()
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce({ rows: [{ balance: 500 }] })
				.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', ends_at: '2099-06-01T18:00:00.000Z' }] })
				.mockResolvedValueOnce({ rows: [{ id: 'opt-1', bet_id: 'bet-1', label: 'Madrid', odd: 1.8 }] })
				.mockResolvedValueOnce({ rows: [] })
				.mockResolvedValueOnce({ rows: [{ balance: 400 }] })
				.mockResolvedValueOnce({ rows: [{ id: 'user-bet-1', user_id: 'user-1', bet_option_id: 'opt-1', amount: 100, odd: 1.8 }] })
				.mockResolvedValueOnce(undefined),
			release: vi.fn(),
		}
		db.getClient.mockResolvedValueOnce(client)

		await expect(
			betsModel.placeBetForUser(
				'11111111-1111-1111-1111-111111111111',
				'22222222-2222-2222-2222-222222222222',
				'33333333-3333-3333-3333-333333333333',
				100,
			),
		).resolves.toEqual({
			id: 'user-bet-1',
			user_id: 'user-1',
			bet_option_id: 'opt-1',
			amount: 100,
			odd: 1.8,
			bet_id: '22222222-2222-2222-2222-222222222222',
			bet_label: 'Final',
			option_label: 'Madrid',
			balance: 400,
		})

		expect(client.query).toHaveBeenCalledWith('BEGIN')
		expect(client.query).toHaveBeenCalledWith(
			'INSERT INTO user_bets (user_id, bet_option_id, amount, odd) VALUES ($1, $2, $3, $4) RETURNING *',
			['11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 100, 1.8],
		)
		expect(client.query).toHaveBeenCalledWith('COMMIT')
		expect(client.release).toHaveBeenCalled()
	})

	it('uses the stored user bet odd when building the settlement preview payouts', async () => {
		db.query
			.mockResolvedValueOnce({ rows: [{ id: 'opt-1', bet_id: 'bet-1', label: 'Madrid', odd: 1.2 }] })
			.mockResolvedValueOnce({
				rows: [{
					user_id: 'user-1',
					amount: '100',
					payout: '180',
				}],
			})

		await expect(
			betsModel.getSettlementPreview(
				'11111111-1111-1111-1111-111111111111',
				'22222222-2222-2222-2222-222222222222',
			),
		).resolves.toEqual({
			winningOption: { id: 'opt-1', bet_id: 'bet-1', label: 'Madrid', odd: 1.2 },
			winners: [{
				user_id: 'user-1',
				amount: '100',
				payout: '180',
			}],
		})

		expect(db.query).toHaveBeenNthCalledWith(
			2,
			`
        SELECT
            ub.user_id,
            COALESCE(SUM(ub.amount), 0) AS amount,
            COALESCE(SUM(ub.amount * ub.odd), 0) AS payout
        FROM user_bets ub
        INNER JOIN bets_options bo ON bo.id = ub.bet_option_id
        WHERE bo.bet_id = $1 AND bo.id = $2
        GROUP BY ub.user_id
        ORDER BY payout DESC, ub.user_id ASC
    `,
			['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'],
		)
	})

	it('updates option odds in a single transaction', async () => {
		const client = {
			query: vi
				.fn()
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined),
			release: vi.fn(),
		}
		db.getClient.mockResolvedValueOnce(client)

		await expect(
			betsModel.updateOptionOdds([
				{ id: 'opt-1', odd: 1.19 },
				{ id: 'opt-2', odd: 4.75 },
			]),
		).resolves.toBeUndefined()

		expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN')
		expect(client.query).toHaveBeenNthCalledWith(
			2,
			'UPDATE bets_options SET odd = $1 WHERE id = $2',
			[1.19, 'opt-1'],
		)
		expect(client.query).toHaveBeenNthCalledWith(
			3,
			'UPDATE bets_options SET odd = $1 WHERE id = $2',
			[4.75, 'opt-2'],
		)
		expect(client.query).toHaveBeenNthCalledWith(4, 'COMMIT')
		expect(client.release).toHaveBeenCalled()
	})

	it('rolls back when the user already bet on the same market', async () => {
		const client = {
			query: vi
				.fn()
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce({ rows: [{ balance: 500 }] })
				.mockResolvedValueOnce({ rows: [{ id: 'bet-1', label: 'Final', ends_at: '2099-06-01T18:00:00.000Z' }] })
				.mockResolvedValueOnce({ rows: [{ id: 'opt-1', bet_id: 'bet-1', label: 'Madrid', odd: 1.8 }] })
				.mockResolvedValueOnce({ rows: [{ id: 'user-bet-1', bet_option_id: 'opt-1', option_label: 'Madrid' }] })
				.mockResolvedValueOnce(undefined),
			release: vi.fn(),
		}
		db.getClient.mockResolvedValueOnce(client)

		await expect(
			betsModel.placeBetForUser(
				'11111111-1111-1111-1111-111111111111',
				'22222222-2222-2222-2222-222222222222',
				'33333333-3333-3333-3333-333333333333',
				100,
			),
		).resolves.toEqual({
			code: 'BET_ALREADY_PLACED_ON_MARKET',
			existingBetId: 'user-bet-1',
			existingBetOptionId: 'opt-1',
			existingOptionLabel: 'Madrid',
		})

		expect(client.query).toHaveBeenCalledWith('ROLLBACK')
		expect(client.query).not.toHaveBeenCalledWith('COMMIT')
		expect(client.release).toHaveBeenCalled()
	})
})
