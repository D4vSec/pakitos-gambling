import db from "#config/db"

const logAction = async (user_id, action, details, ip_address, user_agent) => {
	await db.query(
		"INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)",
		[user_id, action, details, ip_address, user_agent],
	)
}

const getAuditLogs = async () => {
	//TODO: Implement pagination for audit logs
	const result = await db.query("SELECT * FROM audit_logs ORDER BY created_at DESC")
	return result.rows
}

export default {
	logAction,
	getAuditLogs,
}
