> ⚡ Modo pro, para que Yeray no se queje

<!-- Gepeteada lo se pero me la pela -->

### Anotaciones

<!-- 29/04/26 -->

- **Registros en logs sin userID**
  - Me he percatado que hay logs sin userID, supongo que es porque son registros que pertenecen a un usuario eliminado

### 🐞 Bugs

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

- **Broken Object Level Authorization**
  - The Blackjack session store trusts gameId alone. None of the mutation endpoints (hit, stand, double, split, delete) verify that the session belongs to req.user.id, and payouts are applied to the current caller's balance.

## CHECKLIST

- [x] Continuar partida (get/:gameId)
- [x] Lógica del dealer
- [x] Split de manos
- [x] Empates (push)
- [x] Broken Object Level Authorization
- [ ] Refactor del BJ
- [ ] Mirar registros logs sin userID
