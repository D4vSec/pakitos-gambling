import express from "express"
import adminMiddleware from "#middlewares/adminMiddleware"
import getAuditLogs from "#controllers/auditController"

const auditRoutes = express.Router()

auditRoutes.post("/", adminMiddleware, getAuditLogs)

export default auditRoutes
