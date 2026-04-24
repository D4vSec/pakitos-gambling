import express from 'express'
import adminMiddleware from '#middlewares/adminMiddleware'
import authMiddleware from '#middlewares/authMiddleware'
import getAuditLogs from '#controllers/auditController'

const auditRoutes = express.Router()

auditRoutes.get('/', authMiddleware, adminMiddleware, getAuditLogs)

export default auditRoutes
