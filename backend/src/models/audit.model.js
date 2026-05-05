import db from "#config/db.config"

const logAction = async (user_id, action, details, ip_address, user_agent) => {
  await db.query(
    "INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)",
    [user_id, action, details, ip_address, user_agent],
  )
}

const countAuditLogs = async () => {
  const result = await db.query("SELECT COUNT(*)::int AS count FROM audit_logs")
  return result.rows[0]?.count ?? 0
}

const getAuditLogs = async (page = 1, limit = 20) => {
  if (limit > 100) limit = 100
  if (page < 1) page = 1

  const offset = (page - 1) * limit
  const result = await db.query(
    "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset],
  )
  return result.rows
}

export default {
  logAction,
  getAuditLogs,
  countAuditLogs,
}
