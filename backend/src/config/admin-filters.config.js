import { AUDIT_TYPES } from "#config/audit.config"
import { TRANSACTION_TYPES } from "#config/transactions.config"

const SORT_ORDERS = Object.freeze(["asc", "desc", "none"])
const USER_ROLES = Object.freeze(["user", "admin"])
const LEGACY_AUDIT_FILTERS = Object.freeze(["userId", "action", "date"])

const AUDIT_SELECTABLE_COLUMNS = Object.freeze({
	id: "id",
	userId: "user_id",
	user_id: "user_id",
	action: "action",
	details: "details",
	ip: "ip_address",
	ipAddress: "ip_address",
	ip_address: "ip_address",
	userAgent: "user_agent",
	user_agent: "user_agent",
	createdAt: "created_at",
	created_at: "created_at",
})

const AUDIT_DEFAULT_COLUMNS = Object.freeze(["id", "user_id", "action", "details", "ip_address", "user_agent", "created_at"])
const AUDIT_FILTER_FIELDS = Object.freeze(["id", "userId", "user_id", "action", "ip", "ipAddress", "ip_address", "userAgent", "user_agent", "details", "createdAt", "created_at"])

const USER_SELECTABLE_COLUMNS = Object.freeze({
	id: "id",
	userId: "id",
	user_id: "id",
	username: "username",
	email: "email",
	role: "role",
	balance: "balance",
	createdAt: "created_at",
	created_at: "created_at",
	updatedAt: "updated_at",
	updated_at: "updated_at",
})

const USER_DEFAULT_COLUMNS = Object.freeze(["id", "username", "email", "role", "balance"])
const USER_FILTER_FIELDS = Object.freeze(["id", "userId", "user_id", "username", "email", "role", "balance", "createdAt", "created_at", "updatedAt", "updated_at"])

const TRANSACTION_SELECTABLE_COLUMNS = Object.freeze({
	id: "id",
	userId: "user_id",
	user_id: "user_id",
	amount: "amount",
	type: "type",
	createdAt: "created_at",
	created_at: "created_at",
})

const TRANSACTION_DEFAULT_COLUMNS = Object.freeze(["id", "amount", "type", "created_at"])
const TRANSACTION_FILTER_FIELDS = Object.freeze(["id", "userId", "user_id", "amount", "type", "createdAt", "created_at"])

export {
	AUDIT_DEFAULT_COLUMNS,
	AUDIT_FILTER_FIELDS,
	AUDIT_SELECTABLE_COLUMNS,
	AUDIT_TYPES,
	LEGACY_AUDIT_FILTERS,
	SORT_ORDERS,
	TRANSACTION_DEFAULT_COLUMNS,
	TRANSACTION_FILTER_FIELDS,
	TRANSACTION_SELECTABLE_COLUMNS,
	TRANSACTION_TYPES,
	USER_DEFAULT_COLUMNS,
	USER_FILTER_FIELDS,
	USER_ROLES,
	USER_SELECTABLE_COLUMNS,
}
