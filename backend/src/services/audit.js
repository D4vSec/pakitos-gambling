import Audit from "#models/auditModel"

const getClientIp = (req) => {
	const xForwardedFor = req.headers["x-forwarded-for"]

	if (xForwardedFor) return xForwardedFor.split(",")[0].trim()

	return req.socket?.remoteAddress || null
}

const getUserAgent = (req) => {
	return req.headers["user-agent"] || "Unknown"
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
