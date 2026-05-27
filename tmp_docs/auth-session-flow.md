# Auth session flow

1. **Login inicial**  
   El frontend hace `POST /api/v1/auth/login` con credenciales.  
   El backend valida usuario/password, genera:
   - `accessToken` con expiración corta (`15m`)
   - `refreshToken` con expiración larga (`60d`)  
   Luego guarda en DB una sesión con el **hash del refresh token** y `expires_at` alineado con esos `60d`.  
   El frontend guarda ambos tokens en `localStorage.tokens`.

2. **Request autenticada normal**  
   El frontend envía:
   - `Authorization: Bearer <accessToken>`
   - `x-refresh-token: <refreshToken>`  
   El backend entra por `auth.middleware.js` y verifica el access token.

3. **Access token válido**  
   Si el access sigue vivo:
   - se acepta la request,
   - se rellena `req.user`,
   - no hay rotación,
   - no se toca la sesión en DB.  
   Además, como ahora el access token lleva `id` y `role`, en muchos casos ni siquiera hace falta consultar usuario en DB.

4. **Access token expirado**  
   Si el access ha caducado:
   - el middleware no corta directamente,
   - usa el `x-refresh-token`,
   - valida el JWT refresh,
   - busca las sesiones activas del usuario,
   - compara el refresh recibido contra los hashes guardados en DB,
   - comprueba que la sesión no esté revocada ni expirada.

5. **Refresh válido y sesión activa**  
   Si el refresh es correcto:
   - **no se revoca la sesión**,
   - **no se crea una sesión nueva**,
   - **no se rota el refresh token**,
   - solo se genera un **nuevo access token**.  
   Ese nuevo access token se devuelve en header:
   - `x-access-token: <nuevoAccessToken>`  
   Y el middleware deja pasar la request original.

6. **Persistencia automática en frontend**  
   El frontend, a través de `useAPI.js`, inspecciona todos los headers de respuesta.  
   Si encuentra:
   - `x-access-token`
   - `x-refresh-token`  
   actualiza `localStorage.tokens` automáticamente.  
   En la práctica, con el sistema actual casi siempre cambiará solo `x-access-token`, y el refresh seguirá siendo el mismo.

7. **Recarga de app / restauración de sesión**  
   Cuando arranca la app, `SessionProvider.jsx`:
   - lee `accessToken` y `refreshToken` desde `localStorage`,
   - llama a `getUserData()`,
   - envía ambos headers.  
   Si el access aún vale, devuelve usuario.  
   Si el access ha expirado pero el refresh sigue válido, el middleware hace auto-renew y la app sigue funcionando sin login manual.

8. **Cuándo se invalida realmente la sesión**  
   La sesión se considera inválida cuando:
   - el refresh token JWT ha expirado, o
   - la sesión en DB ya ha expirado, o
   - la sesión ha sido revocada, o
   - el refresh no coincide con ningún hash válido.

9. **Qué pasa si el refresh ha expirado**  
   Si el refresh ya está muerto:
   - el middleware devuelve error de sesión expirada,
   - además revoca en DB la sesión asociada si logra identificarla,
   - el frontend ya no puede auto-renovar,
   - el usuario debe volver a autenticarse.

10. **Qué carga pega ahora a la DB**  
    Antes, cada expiración del access hacía:
    - revocar sesión,
    - crear sesión nueva,
    - rotar refresh.  
    Ahora no.  
    Ahora, cuando expira el access, la DB solo se toca para:
    - localizar la sesión activa,
    - comparar el refresh,
    - comprobar expiración/revocación.  
    Eso reduce bastante la carga y elimina la lógica rota anterior.

11. **Resumen conceptual del modelo**  
    El sistema ahora funciona como:
    - **access token** = credencial corta para autorizar requests,
    - **refresh token** = credencial larga para mantener la sesión,
    - **sesión DB** = registro servidor-side que valida que ese refresh sigue autorizado,
    - **auto-renew** = lo hace el middleware, no un endpoint público `/refresh`.

12. **Secuencia completa de vida de sesión**  
    Login -> guardar tokens -> requests normales con access+refresh -> si access expira, middleware emite access nuevo -> frontend lo guarda automáticamente -> la sesión sigue viva mientras el refresh y la sesión DB sigan válidos -> cuando el refresh expira o la sesión queda inválida, se fuerza nuevo login.
