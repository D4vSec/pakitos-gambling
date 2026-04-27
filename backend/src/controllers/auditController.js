import AuditService from "#services/audit"

const getAuditLogs = async (req, res) => {
	try {
		const logs = await AuditService.getAuditLogs()
		res.json(logs || [])
	} catch (err) {
		console.error(err)
		res.status(500).json({ code: "SERVER_ERROR" })
	}
}

export default getAuditLogs
