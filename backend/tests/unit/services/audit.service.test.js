import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

import auditService from '../../../src/services/audit.service.js'
import Audit from '#models/audit.model'
import logger from '#utils/logger.utils'

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

	it('formats user agents by device type', () => {
		expect(
			auditService.getUserAgentRaw({
				useragent: {
					browser: 'Chrome',
					version: '120.0',
					os: 'Windows',
					platform: 'Win32',
					isMobile: true,
					isTablet: false,
					isDesktop: false,
				},
			}),
		).toEqual({
			raw: {
				browser: 'Chrome',
				version: '120.0',
				os: 'Windows',
				platform: 'Win32',
				isMobile: true,
				isTablet: false,
				isDesktop: false,
			},
			formatted: 'Chrome 120.0 / Windows (Mobile)',
		})

		expect(
			auditService.getUserAgentRaw({
				useragent: {
					browser: 'Safari',
					version: '17.0',
					os: 'iOS',
					platform: 'iPhone',
					isMobile: false,
					isTablet: true,
					isDesktop: false,
				},
			}),
		).toEqual(expect.objectContaining({ formatted: 'Safari 17.0 / iOS (Tablet)' }))

		expect(
			auditService.getUserAgentRaw({
				useragent: {
					browser: 'Firefox',
					version: '126.0',
					os: 'Linux',
					platform: 'x86_64',
					isMobile: false,
					isTablet: false,
					isDesktop: true,
				},
			}),
		).toEqual(expect.objectContaining({ formatted: 'Firefox 126.0 / Linux (Desktop)' }))
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

	it('logs errors when audit creation fails', async () => {
		Audit.logAction.mockRejectedValueOnce(new Error('boom'))

		await auditService.createAudit({
			user_id: 7,
			action: 'LOGIN',
			details: { source: 'test' },
			ip_address: '127.0.0.1',
			user_agent: 'Vitest',
		})

		expect(logger.error).toHaveBeenCalled()
	})

	it('delegates audit log retrieval to the model', async () => {
		Audit.getAuditLogs.mockResolvedValueOnce([{ id: 1 }])

		await expect(auditService.getAuditLogs(2, 25, { action: 'LOGIN' })).resolves.toEqual([{ id: 1 }])

		expect(Audit.getAuditLogs).toHaveBeenCalledWith(2, 25, { action: 'LOGIN' })
	})
})
