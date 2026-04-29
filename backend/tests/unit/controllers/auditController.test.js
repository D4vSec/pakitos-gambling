import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#services/audit', () => ({
	default: {
		getAuditLogs: vi.fn(),
		countAuditLogs: vi.fn(),
	},
}))

import getAuditLogs from '../../../src/controllers/auditController.js'
import AuditService from '#services/audit'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('auditController', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	it('returns audit logs when the service succeeds', async () => {
		const logs = [{ id: 1, action: 'LOGIN' }]
		AuditService.countAuditLogs.mockResolvedValueOnce(1)
		AuditService.getAuditLogs.mockResolvedValueOnce(logs)
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(res.json).toHaveBeenCalledWith({ page: 1, limit: 20, totalPages: 1, logs })
	})

	it('returns an empty array when the service returns no logs', async () => {
		AuditService.countAuditLogs.mockResolvedValueOnce(0)
		AuditService.getAuditLogs.mockResolvedValueOnce(null)
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(res.json).toHaveBeenCalledWith({ page: 1, limit: 20, totalPages: 1, logs: [] })
	})

	it('returns 500 when the service throws', async () => {
		AuditService.getAuditLogs.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})
})
