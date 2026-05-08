import { beforeEach, describe, expect, it, vi } from 'vitest'

import auditService from '../../../src/services/audit.service.js'
import Audit from '#models/audit.model'

vi.mock('#models/audit.model', () => ({
	default: {
		logAction: vi.fn(),
		getAuditLogs: vi.fn(),
	},
}))

describe('audit service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('gets client ip from x-forwarded-for', () => {
		const req = {
			headers: {
				'x-forwarded-for': '203.0.113.10, 198.51.100.7',
			},
			socket: {
				remoteAddress: '127.0.0.1',
			},
		}

		expect(auditService.getClientIp(req)).toBe('203.0.113.10')
	})

	it('gets client ip from socket when proxy header is missing', () => {
		const req = {
			headers: {},
			socket: {
				remoteAddress: '127.0.0.1',
			},
		}

		expect(auditService.getClientIp(req)).toBe('127.0.0.1')
	})

	it('uses Unknown as default user agent', () => {
		expect(auditService.getUserAgent({ headers: {} })).toBe('Unknown')
	})

	it('skips audit creation without required fields', async () => {
		await auditService.createAudit({ action: 'LOGIN' })

		expect(Audit.logAction).not.toHaveBeenCalled()
	})

	it('forwards valid audit entries to the model', async () => {
		await auditService.createAudit({
			user_id: 7,
			action: 'LOGIN',
			details: { source: 'test' },
			ip_address: '127.0.0.1',
			user_agent: 'Vitest',
		})

		expect(Audit.logAction).toHaveBeenCalledWith(7, 'LOGIN', { source: 'test' }, '127.0.0.1', 'Vitest')
	})

	it('delegates audit log retrieval to the model', async () => {
		Audit.getAuditLogs.mockResolvedValueOnce([{ id: 1 }])

		await expect(auditService.getAuditLogs(2, 25, { action: 'LOGIN' })).resolves.toEqual([{ id: 1 }])

		expect(Audit.getAuditLogs).toHaveBeenCalledWith(2, 25, { action: 'LOGIN' })
	})
})
