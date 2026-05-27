# Backend tests faltantes


## Pendiente

### `middlewares/ratelimit.middleware.js`

- `authLimiter`
- `registrationLimiter`
- `gameLimiter`
- `historyLimiter`
- `globalLimiter`

### `controllers/slots.controller.js`

- `createSlot`
- `spinSlot`
- `getSlotSession`
- `endSlotSession`

Casos clave: body inválido, tipo de máquina inválido, saldo insuficiente, sesión inexistente, usuario no dueño, victoria/derrota y cierre de sesión.

### `controllers/blackjack.controller.js`

- `startGame`
- `hit`
- `stand`
- `double`
- `split`
- `getGame`
- `deleteGame`
- `getGames`

Casos clave: apuesta inválida, saldo insuficiente, blackjack inicial, permisos por usuario, split, dobles manos, estados finalizado/ongoing y pago/push.

### `controllers/bets.controller.js`

- `getBets`
- `getBetInfo`
- `deleteBet`
- `updateBet`
- `placeBet`

Casos clave: opción inexistente, importe inválido, apuesta cerrada, saldo insuficiente, creación de apuesta y auditoría.

### `controllers/capyroad.controller.js`

- `startGame`
- `jumpRoad`
- `destroyGame`
- `getGame`
- `getGames`

Casos clave: saldo insuficiente, validación de dueño, juego inexistente, juego finalizado, crash/win y limpieza de sesión.

### `services/slots.service.js`

- `spinReel`
- `spinGrid`
- `getLineSymbols`
- `evaluateLine`
- `evaluateGrid`
- `calculatePayout`
- `spin`
- validación de `machineType`

### `services/blackjack.service.js`

- `createDeck`
- `shuffleDeck`
- `calculateHandValue`
- `getInitialHand`
- `hit`
- `double`
- `split`
- `dealerPlay`
- `dealerPlaySplit`
- `determinateWinner`
- `hideDealerCard`
- `setHand`
- `getPayout`

### `services/bets.service.js`

- `calculateOdds`
- `updateOddsForBet`

### `services/capyroad.service.js`

- `incrementMultiplier`
- `incrementRoad`
- `incrementCrashProbability`
- `checkCrash`

### `models/session.model.js`

- `createSession`
- `getActiveSessionsByUserId`
- `revokeSession`
- `verifyTokenMatch`

### `models/bets.model.js`

- `createBet`
- `createBetOption`
- `placeBet`
- `getBets`
- `getBetById`
- `getBetInfo`
- `updateOptionOdd`
- `getOptionsByOptionId`
- `getPoolDistribution`



### `utils/admin-query-validation.utils.js`
- `toOptionalNumber`
- `validateDateInput`
- `csvUuidSchema`
- `csvEnumSchema`
- `csvTextSchema`
- `csvNumberSchema`
- `optionalEnumSchema`
- `optionalColumnsSchema`
- `createStructuredFiltersSchema`
- `createListQuerySchema`