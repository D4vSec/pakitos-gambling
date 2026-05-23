### 🐞 Bugs

<!-- 23/05/26 -->

- **Error al obtener uan partida ya iniciada por id**

```txt
node_backend  | ReferenceError: blackJack is not defined
node_backend  |     at getGame (file:///app/src/controllers/blackjack.controller.js:637:26)
node_backend  |     at Layer.handleRequest (/app/node_modules/router/lib/layer.js:152:17)
node_backend  |     at next (/app/node_modules/router/lib/route.js:157:13)
node_backend  |     at authMiddleware (file:///app/src/middlewares/auth.middleware.js:27:10)
node_backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
node_backend  | [12:14:41.401] ERROR (31): Error getting game:
```

## CHECKLIST

- [x] blackJack existe en getGame
