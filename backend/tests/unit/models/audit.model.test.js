import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#config/db.config', () => ({
	default: {
		query: vi.fn(),
	},
}))

import db from '#config/db.config'
import auditModel from '../../../src/models/audit.model.js'

describe('audit model', () => {
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
				userId: 7,
				fromDate: '2026-05-01T00:00:00.000Z',
				toDate: '2026-05-08T23:59:59.999Z',
			}),
		).resolves.toEqual([{ id: 1 }])

		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM audit_logs WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3 ORDER BY created_at DESC LIMIT $4 OFFSET $5',
			[
				7,
				'2026-05-01T00:00:00.000Z',
				'2026-05-08T23:59:59.999Z',
				15,
				30,
			],
		)
	})
})
