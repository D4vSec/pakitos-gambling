import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("pg", () => ({
	Pool: class {
		connect = vi.fn()
		query = vi.fn()
	},
}))

vi.mock("#utils/logger.utils", () => ({
	default: {
		info: vi.fn(),
		fatal: vi.fn(),
	},
}))

import { AUDIT_TYPES } from "#config/audit.config"
import { ensureAuditActionTypes } from "../../../src/config/db.config.js"

describe("database audit schema compatibility", () => {
	let client

	beforeEach(() => {
		client = {
			query: vi.fn(),
		}
	})

	it("adds every supported audit action to an existing enum", async () => {
		client.query.mockResolvedValueOnce({ rows: [{ exists: true }] })
		client.query.mockResolvedValue({ rows: [] })

		await ensureAuditActionTypes(client)

		expect(client.query).toHaveBeenCalledTimes(AUDIT_TYPES.length + 1)
		for (const action of AUDIT_TYPES) {
			expect(client.query).toHaveBeenCalledWith(
				`ALTER TYPE audit_action ADD VALUE IF NOT EXISTS '${action}'`,
			)
		}
	})

	it("does nothing when the audit enum has not been created yet", async () => {
		client.query.mockResolvedValueOnce({ rows: [{ exists: false }] })

		await ensureAuditActionTypes(client)

		expect(client.query).toHaveBeenCalledTimes(1)
	})
})
