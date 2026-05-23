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
	const userId = '11111111-1111-1111-1111-111111111111'

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
				userId,
				page: '2',
				limit: '50',
			},
		}, res)

		expect(AuditService.countAuditLogs).toHaveBeenCalledWith({ userId: [userId] })
		expect(AuditService.getAuditLogs).toHaveBeenCalledWith(2, 50, { userId: [userId] })
	})

	it('returns 500 when the service throws', async () => {
		AuditService.countAuditLogs.mockResolvedValueOnce(1)
		AuditService.getAuditLogs.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getAuditLogs({}, res)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})

	it('rejects invalid audit sort columns', async () => {
		const res = createResponse()

		await getAuditLogs({
			query: {
				sortBy: 'drop_table',
			},
		}, res)

		expect(AuditService.countAuditLogs).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json.mock.calls[0][0].errors).toBeDefined()
	})
})
