import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#services/audit.service', () => ({
	default: {
		getAuditLogs: vi.fn(),
		countAuditLogs: vi.fn(),
	},
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

import getAuditLogs from '../../../src/controllers/audit.controller.js'
import AuditService from '#services/audit.service'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('audit.controller', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns audit logs when the service succeeds', async () => {
		const logs = [{ id: 1, action: 'LOGIN' }]
		AuditService.countAuditLogs.mockResolvedValueOnce(1)
		AuditService.getAuditLogs.mockResolvedValueOnce(logs)
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(AuditService.countAuditLogs).toHaveBeenCalledWith({})
		expect(AuditService.getAuditLogs).toHaveBeenCalledWith(1, 20, {})
		expect(res.json).toHaveBeenCalledWith({ page: 1, limit: 20, totalPages: 1, logs })
	})

	it('returns an empty array when the service returns no logs', async () => {
		AuditService.countAuditLogs.mockResolvedValueOnce(0)
		AuditService.getAuditLogs.mockResolvedValueOnce(null)
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(AuditService.countAuditLogs).toHaveBeenCalledWith({})
		expect(AuditService.getAuditLogs).toHaveBeenCalledWith(1, 20, {})
		expect(res.json).toHaveBeenCalledWith({ page: 1, limit: 20, totalPages: 1, logs: [] })
	})

	it('passes audit filters to the service', async () => {
		AuditService.countAuditLogs.mockResolvedValueOnce(100)
		AuditService.getAuditLogs.mockResolvedValueOnce([])
		const res = createResponse()

		await getAuditLogs({
			query: {
				filter: 'userId',
				userId: '7',
				page: '2',
				limit: '50',
			},
		}, res)

		expect(AuditService.countAuditLogs).toHaveBeenCalledWith({ userId: 7 })
		expect(AuditService.getAuditLogs).toHaveBeenCalledWith(2, 50, { userId: 7 })
	})

	it('returns 500 when the service throws', async () => {
		AuditService.countAuditLogs.mockResolvedValueOnce(1)
		AuditService.getAuditLogs.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})
})
