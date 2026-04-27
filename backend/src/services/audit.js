import Audit from "#models/auditModel"
import useragent from 'express-useragent';


const getClientIp = (req) => {
	const xForwardedFor = req.headers["x-forwarded-for"]

	if (xForwardedFor) return xForwardedFor.split(",")[0].trim()

	return req.socket?.remoteAddress || null
}

const getUserAgent = (req) => {
    if (!req.useragent) return "Unknown";

    const { browser, version, os, platform, isMobile, isTablet, isDesktop } = req.useragent;
    
    let deviceType = 'Unknown';
    if (isMobile) deviceType = 'Mobile';
    if (isTablet) deviceType = 'Tablet';
    if (isDesktop) deviceType = 'Desktop';

    return `${browser} ${version} / ${os} (${deviceType})`;
}

const createAudit = async (auditData) => {
	try {
		const { user_id, action, details, ip_address, user_agent } = auditData

		if (!user_id || !action) return

		await Audit.logAction(user_id, action, details, ip_address, user_agent)
	} catch (err) {
		console.error("Audit log error:", err)
	}
}

const getAuditLogs = async () => {
	return await Audit.getAuditLogs()
}

export default {
	createAudit,
	getAuditLogs,
	getClientIp,
	getUserAgent,
}
