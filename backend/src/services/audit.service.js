import Audit from "#models/audit.model"
import { isIP } from "node:net"
import logger from "#utils/logger.utils"

const normalizeIpAddress = (value) => {
	if (typeof value !== "string") return null

	let candidate = value.trim()
	if (!candidate) return null

	if (candidate.startsWith("[") && candidate.includes("]")) {
		candidate = candidate.slice(1, candidate.indexOf("]"))
	}

	if (candidate.startsWith("::ffff:") && isIP(candidate.slice(7)) === 4) {
		return candidate.slice(7)
	}

	if (isIP(candidate)) return candidate

	const ipv4WithPort = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/)
	if (ipv4WithPort && isIP(ipv4WithPort[1]) === 4) return ipv4WithPort[1]

	return null
}

const getClientIp = (req) => {
	const xForwardedFor = req.headers["x-forwarded-for"]

	if (typeof xForwardedFor === "string") {
		for (const forwardedIp of xForwardedFor.split(",")) {
			const normalizedIp = normalizeIpAddress(forwardedIp)
			if (normalizedIp) return normalizedIp
		}
	}

	return normalizeIpAddress(req.socket?.remoteAddress)
}

const getUserAgentRaw = (req) => {
	if (!req.useragent) return null

	const { browser, version, os, platform, isMobile, isTablet, isDesktop } = req.useragent

	let deviceType = 'Unknown'
	if (isMobile) deviceType = 'Mobile'
	else if (isTablet) deviceType = 'Tablet'
	else if (isDesktop) deviceType = 'Desktop'

	const raw = { browser, version, os, platform, isMobile, isTablet, isDesktop }
	const formatted = `${browser} ${version} / ${os} (${deviceType})`

	return { raw, formatted }
}

const getUserAgent = (req) => {
	const info = getUserAgentRaw(req)
	return info ? info.formatted : 'Unknown'
}

const createAudit = async (auditData) => {
	try {
		const { user_id, action, details, ip_address, user_agent } = auditData

		if (!user_id || !action) return

		await Audit.logAction(
			user_id,
			action,
			details,
			normalizeIpAddress(ip_address),
			user_agent,
		)
	} catch (err) {
		logger.error(
			{ err, audit: { user_id: auditData?.user_id, action: auditData?.action } },
			"Error creating audit log",
		)
	}
}

const countAuditLogs = async (filters = {}) => await Audit.countAuditLogs(filters)

const getAuditLogs = async (page = 1, limit = 20, filters = {}) => await Audit.getAuditLogs(page, limit, filters)

export default {
	createAudit,
	getClientIp,
	normalizeIpAddress,
	getUserAgentRaw,
	getUserAgent,
	countAuditLogs,
	getAuditLogs
}
