# Admin API Contract

Contrato para el frontend de admin sobre filtros, ordenación y selección de columnas.

## Reglas generales

- Todos los endpoints devuelven `400` con `INVALID_QUERY_PARAMS` si llega un valor fuera del allowlist.
- Los filtros multi-valor se envían como **JSON serializado** en query params. Ejemplo: `type=["BET","WIN"]`.
- Recomendación frontend: usar `URLSearchParams` + `JSON.stringify(...)` para arrays/objetos.
- `sortOrder` solo acepta: `asc`, `desc`, `none`.
- `columns` solo acepta columnas permitidas para ese endpoint.
- `filterField` / `filterValue` permiten un filtro dinámico único.
- `filters` permite múltiples filtros dinámicos en JSON.
- `fromDate` y `toDate` aceptan `YYYY-MM-DD` o ISO 8601.

---

## 1. GET `/api/v1/audit`

### Query params soportados

| Param | Tipo | Valores permitidos |
| --- | --- | --- |
| `page` | number | entero positivo |
| `limit` | number | entero positivo, máximo 100 |
| `id` | uuid \| json array uuid | ids de log |
| `userId` | uuid \| json array uuid | ids de usuario |
| `action` | enum \| json array enum | `USER_REGISTER`, `BET_PLACED`, `BET_RESULT`, `BALANCE_UPDATED`, `ADMIN_ACTION`, `GAME_RESULT` |
| `ipAddress` | string \| json array string | texto libre |
| `userAgent` | string \| json array string | texto libre |
| `details` | string \| json array string | texto libre |
| `fromDate` | date | fecha inicial |
| `toDate` | date | fecha final |
| `columns` | json array enum | `id`, `userId`, `user_id`, `action`, `details`, `ip`, `ipAddress`, `ip_address`, `userAgent`, `user_agent`, `createdAt`, `created_at` |
| `sortBy` | enum | mismas claves permitidas en `columns` |
| `sortOrder` | enum | `asc`, `desc`, `none` |
| `filterField` | enum | `id`, `userId`, `user_id`, `action`, `ip`, `ipAddress`, `ip_address`, `userAgent`, `user_agent`, `details`, `createdAt`, `created_at` |
| `filterValue` | dinámico | valor compatible con `filterField` |
| `filters` | json array/object | filtros dinámicos múltiples |

### Ejemplos por filtro

| Caso | Ejemplo |
| --- | --- |
| Paginación | `/api/v1/audit?page=1&limit=20` |
| Filtrar por log id | `/api/v1/audit?id=11111111-1111-1111-1111-111111111111` |
| Filtrar por usuario | `/api/v1/audit?userId=22222222-2222-2222-2222-222222222222` |
| Filtrar por varias acciones | `/api/v1/audit?action=["ADMIN_ACTION","GAME_RESULT"]` |
| Filtrar por IP | `/api/v1/audit?ipAddress=203.0.113.` |
| Filtrar por user agent | `/api/v1/audit?userAgent=Chrome` |
| Filtrar por texto en details | `/api/v1/audit?details=USER_UPDATED` |
| Fecha desde | `/api/v1/audit?fromDate=2026-05-01` |
| Fecha hasta | `/api/v1/audit?toDate=2026-05-13` |
| Rango de fechas | `/api/v1/audit?fromDate=2026-05-01&toDate=2026-05-13` |
| Selección de columnas | `/api/v1/audit?columns=["id","action","createdAt"]` |
| Ordenación | `/api/v1/audit?sortBy=createdAt&sortOrder=desc` |
| Filtro dinámico único | `/api/v1/audit?filterField=action&filterValue=["ADMIN_ACTION","GAME_RESULT"]` |
| Filtros dinámicos múltiples | `/api/v1/audit?filters=[{"field":"action","values":["ADMIN_ACTION"]},{"field":"userId","values":["22222222-2222-2222-2222-222222222222"]}]` |

### Ejemplo de respuesta

```json
{
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "logs": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "user_id": "22222222-2222-2222-2222-222222222222",
      "action": "ADMIN_ACTION",
      "details": {
        "type": "USER_UPDATED",
        "targetUserId": "33333333-3333-3333-3333-333333333333",
        "date": "2026-05-13T10:00:00.000Z"
      },
      "ip_address": "203.0.113.10",
      "user_agent": "{\"browser\":\"Chrome\"}",
      "created_at": "2026-05-13T10:00:00.000Z"
    }
  ]
}
```

---

## 2. GET `/api/v1/user`

### Query params soportados

| Param | Tipo | Valores permitidos |
| --- | --- | --- |
| `page` | number | entero positivo |
| `limit` | number | entero positivo, máximo 100 |
| `id` | uuid \| json array uuid | id de usuario |
| `userId` | uuid \| json array uuid | alias de `id` |
| `username` | string \| json array string | texto libre |
| `email` | string \| json array string | texto libre |
| `role` | enum \| json array enum | `user`, `admin` |
| `balance` | number \| json array number | importe exacto |
| `minBalance` | number | mínimo balance |
| `maxBalance` | number | máximo balance |
| `fromDate` | date | `created_at >= fromDate` |
| `toDate` | date | `created_at <= toDate` |
| `columns` | json array enum | `id`, `userId`, `user_id`, `username`, `email`, `role`, `balance`, `createdAt`, `created_at`, `updatedAt`, `updated_at` |
| `sortBy` | enum | mismas claves permitidas en `columns` |
| `sortOrder` | enum | `asc`, `desc`, `none` |
| `filterField` | enum | `id`, `userId`, `user_id`, `username`, `email`, `role`, `balance`, `createdAt`, `created_at`, `updatedAt`, `updated_at` |
| `filterValue` | dinámico | valor compatible con `filterField` |
| `filters` | json array/object | filtros dinámicos múltiples |

### Ejemplos por filtro

| Caso | Ejemplo |
| --- | --- |
| Paginación | `/api/v1/user?page=1&limit=10` |
| Filtrar por id | `/api/v1/user?id=22222222-2222-2222-2222-222222222222` |
| Filtrar por username | `/api/v1/user?username=dav` |
| Filtrar por email | `/api/v1/user?email=@example.com` |
| Filtrar por rol | `/api/v1/user?role=admin` |
| Multi-rol | `/api/v1/user?role=["user","admin"]` |
| Filtrar por balance exacto | `/api/v1/user?balance=100` |
| Balance mínimo | `/api/v1/user?minBalance=50` |
| Balance máximo | `/api/v1/user?maxBalance=250` |
| Balance entre rangos | `/api/v1/user?minBalance=50&maxBalance=250` |
| Fecha desde | `/api/v1/user?fromDate=2026-05-01` |
| Fecha hasta | `/api/v1/user?toDate=2026-05-13` |
| Selección de columnas | `/api/v1/user?columns=["id","username","role","balance"]` |
| Ordenación | `/api/v1/user?sortBy=balance&sortOrder=desc` |
| Filtro dinámico único | `/api/v1/user?filterField=role&filterValue=admin` |
| Filtros dinámicos múltiples | `/api/v1/user?filters=[{"field":"role","values":["admin"]},{"field":"username","values":["dav"]}]` |

### Ejemplo de respuesta

```json
{
  "page": 1,
  "limit": 10,
  "totalPages": 2,
  "users": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "username": "dav",
      "email": "dav@example.com",
      "role": "admin",
      "balance": "120.00"
    }
  ]
}
```

---

## 3. GET `/api/v1/user/:id/transactions`

> El mismo contrato de query aplica también a `GET /api/v1/user/me/transactions`.

### Query params soportados

| Param | Tipo | Valores permitidos |
| --- | --- | --- |
| `page` | number | entero positivo |
| `limit` | number | entero positivo, máximo 100 |
| `id` | uuid \| json array uuid | id de transacción |
| `type` | enum \| json array enum | `DEPOSIT`, `WITHDRAWAL`, `BET`, `WIN`, `BONUS`, `REFUND` |
| `amount` | number \| json array number | importe exacto |
| `minAmount` | number | importe mínimo |
| `maxAmount` | number | importe máximo |
| `fromDate` | date | fecha inicial |
| `toDate` | date | fecha final |
| `columns` | json array enum | `id`, `userId`, `user_id`, `amount`, `type`, `createdAt`, `created_at` |
| `sortBy` | enum | mismas claves permitidas en `columns` |
| `sortOrder` | enum | `asc`, `desc`, `none` |
| `filterField` | enum | `id`, `userId`, `user_id`, `amount`, `type`, `createdAt`, `created_at` |
| `filterValue` | dinámico | valor compatible con `filterField` |
| `filters` | json array/object | filtros dinámicos múltiples |

### Ejemplos por filtro

| Caso | Ejemplo |
| --- | --- |
| Paginación | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?page=1&limit=10` |
| Filtrar por transaction id | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa` |
| Filtrar por tipo | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?type=BET` |
| Multi-tipo | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?type=["BET","WIN"]` |
| Filtrar por amount exacto | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?amount=25` |
| Amount mínimo | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?minAmount=10` |
| Amount máximo | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?maxAmount=100` |
| Amount entre rangos | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?minAmount=10&maxAmount=100` |
| Fecha desde | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?fromDate=2026-05-01` |
| Fecha hasta | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?toDate=2026-05-13` |
| Selección de columnas | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?columns=["id","type","amount","createdAt"]` |
| Ordenación | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?sortBy=amount&sortOrder=asc` |
| Filtro dinámico único | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?filterField=type&filterValue=["BET","WIN"]` |
| Filtros dinámicos múltiples | `/api/v1/user/22222222-2222-2222-2222-222222222222/transactions?filters=[{"field":"type","values":["BET","WIN"]},{"field":"amount","values":[25,50]}]` |

### Ejemplo de respuesta

```json
{
  "page": 1,
  "limit": 10,
  "totalPages": 4,
  "transactions": [
    {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "amount": "25.00",
      "type": "BET",
      "created_at": "2026-05-13T11:00:00.000Z"
    }
  ]
}
```

---

## Errores esperables

| Código | Cuándo ocurre |
| --- | --- |
| `INVALID_QUERY_PARAMS` | columna, enum, UUID, JSON de `filters` o tipo de query inválido |
| `INVALID_DATE_RANGE` | `fromDate > toDate` |
| `PAGE_EXCEDED` | se pide una página mayor que `totalPages` |
| `USER_NOT_FOUND` | el `:id` no existe o no es UUID válido en rutas de usuario |
