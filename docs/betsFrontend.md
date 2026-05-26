# Bets frontend contract

## Estado actual

La restriccion **ya esta implementada en backend**: un usuario **no puede apostar dos veces al mismo mercado**.

Si el usuario ya hizo una apuesta en ese mercado, el backend responde `409` con el codigo `BET_ALREADY_PLACED_ON_MARKET`.

Ademas, al obtener el listado de mercados autenticado, backend devuelve si el usuario ya tiene apuesta en cada mercado para mejorar la UX.

Implementacion backend:

- `backend/src/controllers/bets.controller.js`
- `backend/src/models/bets.model.js`
- `backend/src/services/bets.service.js`

---

## Endpoint para listar mercados

`GET /api/v1/bets`

### Auth headers

```http
Authorization: Bearer <accessToken>
x-refresh-token: <refreshToken>
```

### Respuesta OK

### `200 OK`

```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "label": "Champions League Winner",
    "ends_at": "2026-06-01T18:00:00.000Z",
    "status": "open",
    "options": [
      {
        "id": "22222222-2222-2222-2222-222222222222",
        "label": "Madrid",
        "odd": 1.8
      },
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "label": "Barca",
        "odd": 2.1
      }
    ],
    "hasUserBet": true,
    "userBet": {
      "id": "44444444-4444-4444-4444-444444444444",
      "betOptionId": "22222222-2222-2222-2222-222222222222",
      "optionLabel": "Madrid",
      "amount": 100,
      "odd": 1.8
    }
  }
]
```

### Campos de UX por mercado

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `hasUserBet` | `boolean` | Indica si el usuario autenticado ya tiene una apuesta en ese mercado |
| `userBet` | `object \| null` | Datos de la apuesta del usuario en ese mercado |
| `userBet.id` | `uuid` | Id de la apuesta ya realizada |
| `userBet.betOptionId` | `uuid` | Opcion elegida por el usuario |
| `userBet.optionLabel` | `string` | Label de la opcion elegida |
| `userBet.amount` | `number` | Importe apostado en ese mercado |
| `userBet.odd` | `number` | Cuota de la opcion elegida |

### Cuando el usuario no tiene apuesta en ese mercado

```json
{
  "hasUserBet": false,
  "userBet": null
}
```

---

## Endpoint para apostar

`POST /api/v1/bets/:betId/place`

### Auth headers

```http
Authorization: Bearer <accessToken>
x-refresh-token: <refreshToken>
Content-Type: application/json
```

### Params

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `betId` | `uuid` | si | Id del mercado |

### Body

```json
{
  "betOptionId": "22222222-2222-2222-2222-222222222222",
  "amount": 100
}
```

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `betOptionId` | `uuid` | si | Id de la opcion elegida dentro del mercado |
| `amount` | `number` | si | Importe apostado, debe ser mayor que `0` |

---

## Respuesta OK

### `201 Created`

```json
{
  "id": "33333333-3333-3333-3333-333333333333",
  "user_id": "44444444-4444-4444-4444-444444444444",
  "bet_option_id": "22222222-2222-2222-2222-222222222222",
  "amount": 100,
  "bet_id": "11111111-1111-1111-1111-111111111111",
  "bet_label": "Champions League Winner",
  "option_label": "Madrid",
  "odd": 1.8,
  "balance": 400
}
```

### Campos relevantes para frontend

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id` | `uuid` | Id de la apuesta creada |
| `bet_option_id` | `uuid` | Opcion apostada |
| `amount` | `number` | Importe apostado |
| `bet_id` | `uuid` | Mercado apostado |
| `bet_label` | `string` | Nombre del mercado |
| `option_label` | `string` | **Opcion elegida por el usuario** |
| `odd` | `number` | Cuota aplicada |
| `balance` | `number` | Saldo restante tras apostar |

---

## Errores y codigos de respuesta

### `400 Bad Request`

```json
{ "code": "INVALID_BET_AMOUNT" }
```

```json
{ "code": "BET_CLOSED" }
```

```json
{ "code": "INSUFFICIENT_FUNDS" }
```

### `404 Not Found`

```json
{ "code": "BET_NOT_FOUND" }
```

```json
{ "code": "OPTION_NOT_FOUND" }
```

```json
{ "code": "USER_NOT_FOUND" }
```

### `409 Conflict`

El usuario **ya tiene una apuesta en ese mismo mercado**.

```json
{
  "code": "BET_ALREADY_PLACED_ON_MARKET",
  "existingBetId": "33333333-3333-3333-3333-333333333333",
  "existingBetOptionId": "22222222-2222-2222-2222-222222222222",
  "existingOptionLabel": "Madrid"
}
```

### `500 Internal Server Error`

```json
{ "code": "INTERNAL_SERVER_ERROR" }
```

---

## Reglas para frontend

1. Usa `hasUserBet` y `userBet` de `GET /api/v1/bets` para pintar en la UI si el usuario ya ha apostado en cada mercado.
2. No intentes permitir una segunda apuesta sobre el mismo `betId` si ya existe una previa del usuario.
3. Si llega `409 BET_ALREADY_PLACED_ON_MARKET`, muestra mensaje de mercado ya apostado y, si quieres, ensena `existingOptionLabel`.
4. Tras un `201`, usa `option_label` para mostrar claramente a que opcion ha apostado el usuario.
5. El frontend debe considerar `400`, `404`, `409` y `500` como respuestas esperadas del endpoint.
