import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#config/db.config', () => ({
	default: {
		query: vi.fn(),
	},
}))

import db from '#config/db.config'
import auditModel from '../../../src/models/audit.model.js'

describe('audit model', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('counts audit logs with filters', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 2 }] })

		await expect(auditModel.countAuditLogs({ action: 'LOGIN' })).resolves.toBe(2)

		expect(db.query).toHaveBeenCalledWith(
			'SELECT COUNT(*)::int AS count FROM audit_logs WHERE action = $1',
			['LOGIN'],
		)
	})

	it('fetches audit logs with filters and pagination', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] })

		await expect(
			auditModel.getAuditLogs(3, 15, {
				userId,
				fromDate: '2026-05-01T00:00:00.000Z',
				toDate: '2026-05-08T23:59:59.999Z',
			}),
		).resolves.toEqual([{ id: 1 }])

		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM audit_logs WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3 ORDER BY created_at DESC LIMIT $4 OFFSET $5',
			[
				userId,
				'2026-05-01T00:00:00.000Z',
				'2026-05-08T23:59:59.999Z',
				15,
				30,
			],
		)
	})

	it('inserts audit actions', async () => {
		db.query.mockResolvedValueOnce({ rows: [] })

		await expect(
			auditModel.logAction(userId, 'LOGIN', { source: 'test' }, '127.0.0.1', 'Vitest'),
		).resolves.toBeUndefined()

		expect(db.query).toHaveBeenCalledWith(
			'INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
			[userId, 'LOGIN', { source: 'test' }, '127.0.0.1', 'Vitest'],
		)
	})

	it('avoids UUID syntax errors when the user filter is invalid', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 0 }] })

		await expect(auditModel.countAuditLogs({ userId: '4' })).resolves.toBe(0)

		expect(db.query).toHaveBeenCalledWith(
			'SELECT COUNT(*)::int AS count FROM audit_logs WHERE 1 = 0',
			[],
		)
	})

	it('combines multiple audit filters', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 1 }] })

		await expect(
			auditModel.countAuditLogs({
				ipAddress: '203.0.113.10',
				userAgent: 'Chrome',
				details: 'USER_UPDATED',
				filterField: 'action',
				filterValue: 'ADMIN_ACTION',
				fromDate: '2026-05-01',
				toDate: '2026-05-08',
			}),
		).resolves.toBe(1)

		expect(db.query).toHaveBeenCalledWith(
			"SELECT COUNT(*)::int AS count FROM audit_logs WHERE (host(ip_address) ILIKE $1 ESCAPE '\\') AND (user_agent ILIKE $2 ESCAPE '\\') AND (details::text ILIKE $3 ESCAPE '\\') AND created_at >= $4 AND created_at <= $5 AND action = $6",
			[
				'%203.0.113.10%',
				'%Chrome%',
				'%USER\\_UPDATED%',
				'2026-05-01T00:00:00.000Z',
				'2026-05-08T23:59:59.999Z',
				'ADMIN_ACTION',
			],
		)
	})

	it('supports column selection, multi-value filters and custom sorting', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'log-1', action: 'ADMIN_ACTION' }] })

		await expect(
			auditModel.getAuditLogs(1, 20, {
				action: ['ADMIN_ACTION', 'GAME_RESULT'],
				columns: ['id', 'action'],
				sortBy: 'action',
				sortOrder: 'asc',
			}),
		).resolves.toEqual([{ id: 'log-1', action: 'ADMIN_ACTION' }])

		expect(db.query).toHaveBeenCalledWith(
			'SELECT id, action FROM audit_logs WHERE action IN ($1, $2) ORDER BY action ASC LIMIT $3 OFFSET $4',
			['ADMIN_ACTION', 'GAME_RESULT', 20, 0],
		)
	})
})
