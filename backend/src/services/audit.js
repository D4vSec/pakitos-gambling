import Audit from "#models/auditModel"
import useragent from 'express-useragent';
import logger from "#utils/logger"

const getClientIp = (req) => {
	const xForwardedFor = req.headers["x-forwarded-for"]

	if (xForwardedFor) return xForwardedFor.split(",")[0].trim()

	return req.socket?.remoteAddress || null
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

		await Audit.logAction(user_id, action, details, ip_address, user_agent)
	} catch (err) {
		logger.error("Audit log error:", err)
	}
}

const getAuditLogs = async (page = 1, limit = 20) => {
	return await Audit.getAuditLogs(page, limit)
}

export default {
	createAudit,
	getAuditLogs,
	getClientIp,
	getUserAgentRaw,
	getUserAgent,
}
