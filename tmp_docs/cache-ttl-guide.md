# Cache TTL guide

`backend/src/utils/cache.utils.js` exports a generic in-memory TTL cache.

## API

```js
import createCache from "#utils/cache.utils"

const cache = createCache()

cache.set("game-1", { foo: "bar" }, 5 * 60 * 1000, {
  onExpire: ({ key, value, expiresAt }) => {
    // optional cleanup
  },
})

const session = cache.get("game-1")
cache.delete("game-1")
cache.expire("game-1")
cache.clear()
```

## Behavior

- `set(key, value, ttlMs, options)` stores the entry and schedules automatic removal.
- `get(key)` returns `undefined` if the entry does not exist or has expired.
- `delete(key)` removes the entry without running `onExpire`.
- `expire(key)` removes the entry and runs `onExpire` if present.
- `clear()` wipes all entries and cancels timers.

## Game usage

- **Slots**: no refund on TTL expiration. Use TTL only to close abandoned sessions and free memory.
- **Blackjack**: can use `onExpire` to refund the locked bet if the hand expires before finishing.

## Example

```js
activeGames.set(gameId, game, GAME_SESSION_TTL_MS.slots)

blackjackGames.set(gameId, game, GAME_SESSION_TTL_MS.blackjack, {
  onExpire: ({ value: game }) => {
    // refund game.bet if the hand is still open
  },
})
```
