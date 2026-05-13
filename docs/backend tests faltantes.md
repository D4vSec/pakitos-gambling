# Backend unit test gap analysis

Scope: review of `backend/src/` against the current tests in `backend/tests/`.

## Already covered

- `controllers/auth.controller.js`
- `controllers/roulette.controller.js`
- `controllers/audit.controller.js`
- `middlewares/admin.middleware.js`
- `services/audit.service.js`
- `services/roulette.service.js`
- `utils/admin-query.utils.js`
- `models/user.model.js` (partial)
- `models/audit.model.js` (partial)

`app.js` and the route wiring are also exercised indirectly by the HTTP tests in `backend/tests/http/`.

## Partially covered

### `controllers/user.controller.js`

Covered:
- `createTransaction`
- validation failures in `getAllUsers`
- validation failures in `getTransactionsByUserId`

Missing:
- `getProfile`
- `deleteSelf`
- `updateSelf`
- `getUserById`
- `updateUserById`
- `deleteUserById`
- `getSelfBalance`
- happy/error paths for `getAllUsers`
- happy/error paths for `getTransactions`
- happy/error paths for `getTransactionsByUserId`

### `models/user.model.js`

Covered:
- `findTransactionsByUser`
- `countUsers`
- `findUsers`

Missing:
- `createUser`
- `findUserByEmail`
- `findUserById`
- `findAllUsers`
- `updateUser`
- `verifyPassword`
- `deleteUser`
- `getUserBalance`
- `updateUserBalance`
- `countTransactionsByUser`

### `models/audit.model.js`

Covered:
- `countAuditLogs`
- `getAuditLogs`

Missing:
- `logAction`
- more filter combinations and edge cases for `buildAuditFilters`

### `services/audit.service.js`

Covered:
- `getClientIp`
- `getUserAgent`
- `createAudit` happy path
- delegation of log retrieval

Missing:
- `getUserAgentRaw` formatted branches
- error path in `createAudit`

### `utils/admin-query.utils.js`

Covered:
- `getSelectedColumns`
- `getSortClause`
- `pushContainsClause`
- `normalizeList`

Missing:
- `normalizeDate`
- `getFilterGroups`
- `pushInClause`
- `isValidUuid`

### `middlewares/auth.middleware.js`

Only the no-token branch is hit indirectly by the HTTP tests.

Missing:
- valid bearer token flow
- expired access token with refresh token flow
- invalid token flow
- invalid session flow
- session rotation path

## Not covered by unit tests
- `middlewares/ratelimit.middleware.js`
- `services/slots.service.js`
- `services/blackjack.service.js`
- `services/bets.service.js`
- `services/capyroad.service.js`
- `controllers/slots.controller.js`
- `controllers/blackjack.controller.js`
- `controllers/bets.controller.js`
- `controllers/capyroad.controller.js`
- `models/session.model.js`
- `models/bets.model.js`
- `utils/password.utils.js`
- `utils/rng.utils.js`
- `utils/logger.utils.js`
- `utils/admin-query-validation.utils.js`

## Best next targets

1. `auth.middleware.js`
2. `utils/admin-query-validation.utils.js`
3. `controllers/user.controller.js`
4. `models/session.model.js` and `models/bets.model.js`
5. `slots`, `blackjack`, `bets`, and `capyroad` controllers/services

That would close the highest-risk gaps first: auth/session flows, query validation, and game logic.
