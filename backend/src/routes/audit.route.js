import express from 'express'
import adminMiddleware from '#middlewares/admin.middleware'
import authMiddleware from '#middlewares/auth.middleware'
import getAuditLogs from '#controllers/audit.controller'

const auditRoutes = express.Router()

auditRoutes.get('/', authMiddleware, adminMiddleware, getAuditLogs)

export default auditRoutes
