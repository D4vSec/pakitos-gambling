### Anotaciones

### 🐞 Bugs

<!-- 06/05/26 -->

- **No inicia el la partida del blackjack**
  - No inicia la partida, muy probablemente sea un import / export, desconozco si fallará algo más ya que no se ha podido probar

```txt
backend_dev      | ReferenceError: hideDealerCard is not defined
backend_dev      |     at startGame (file:///app/src/controllers/blackjack.controller.js:129:26)
backend_dev      |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
backend_dev      | [11:36:03.283] ERROR (62): Error starting game:
```

- **Broken Object Level Authorization**
  - The Blackjack session store trusts gameId alone. None of the mutation endpoints (hit, stand, double, split, delete) verify that the session belongs to req.user.id, and payouts are applied to the current caller's balance.

- **Continuar partida (get/:gameId)**
  - La segunda carta del dealer se devuelve con el valor verdadero, `suit` ni `value` estan como `"hidden"`.

- **Lógica del dealer**
  - Si el dealer ya ha ganado, deja de robar cartas.
  - Ejemplo:
    - Jugador: 11 → hace _stand_
    - Dealer: tiene un 3 + carta oculta J (total 13)
    - ❌ El dealer no roba más porque ya ha "ganado"
    - ✅ Debería seguir robando hasta:
      - llegar a 17 o más
      - o pasarse de 21

- **Split de manos**
  - Se pueden dividir más de 2 manos
  - ❌ Pero al calcular el final del juego:
    - Si te plantas con 2 manos, las siguientes se ignoran y la partida termina

- **(Duda pendiente)**
  - Limitar a máximo 2 manos por comodidad o permitir más splits correctamente

- **Empates (push)**
  - ❌ Actualmente payout = 0
  - ✅ Debería devolver lo apostado
    - Ejemplo: apuestas 10 → empate → recibes 10

## CHECKLIST

- [ ] Refactor del BJ
- [ ] Mirar registros logs sin userID
- [ ] Poder iniciar partida
- [x] Continuar partida (get/:gameId)
- [x] Lógica del dealer
- [x] Split de manos
- [x] Empates (push)
- [x] Broken Object Level Authorization
