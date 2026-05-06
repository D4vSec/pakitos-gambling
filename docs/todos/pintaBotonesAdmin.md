# Panel de Admin

## Problemas (Log Audit)

- En la columna "Details", no lanzar el texto plano. Usa un visualizador de objetos colapsable.
- Tratamiento de IDs, los UUIDs (8132f248...) ocupan demasiado espacio visual. Puedes acortarlos (ej. 8132...dacc) y añadir un botón de "copiar" al la
- User Agent amigable, en lugar de mostrar el JSON del navegador, el campo que te sirve es combinar los datos del json.

```js
const buildUserAgent = ({
  browser,
  version,
  os,
  platform,
  isMobile,
  isTablet,
  isDesktop,
} = {}) => {
  const clean = (v) => v && v !== "unknown"

  const browserPart = browser
    ? version
      ? `${browser}/${version}`
      : browser
    : null

  const systemParts = [platform, os].filter(clean)
  const systemPart = systemParts.length ? `(${systemParts.join(" | ")})` : null

  let devicePart = null
  if (isMobile) devicePart = "Mobile"
  else if (isTablet) devicePart = "Tablet"
  else if (isDesktop) devicePart = "Desktop"

  return [browserPart, systemPart, devicePart].filter(Boolean).join(" ")
}
```

De esta forma, pasará a ser: `Chrome/142.0.7444.265 (Microsoft Windows | Windows 10.0) Desktop`

### Organización y Filtros

**Filtros Avanzados:** La barra de búsqueda simple no basta. Añade selectores para filtrar específicamente por:

- Action (ej. solo ver `GAME_RESULT`).
- Rango de fechas (Date picker).
- Resultado (Ganado/Perdido basándose en el payout).

## Problemas (Gestión de Usuarios)

- Los encabezados (Username, Email, etc.) están alineados a la izquierda, pero los datos debajo parecen tener un espaciado algo irregular.
- En lugar de texto plano para admin y user, usa "badges" (etiquetas con fondo redondeado). Ej: Admin en azul suave, User en gris. Esto permite identificar niveles de acceso de un vistazo.

### Usabilidad (UX)

- El botón "Clear search" es casi tan grande como el input. Podría ser simplemente una "X" dentro de la barra de búsqueda.
- Los botones de Create new user y View logs están flotando abajo de forma un poco extraña. Normalmente, "Crear nuevo usuario" debería estar arriba a la derecha, cerca de la tabla, como una acción principal.

# Checklist

[ ] Sustituir el texto plano en la columna "Details" por un componente de visualización de JSON colapsable (ej. react-json-view o similar).
[x] Implementar función de truncado (ej. 8132...dacc).
[x] Añadir botón "Copy to clipboard" discreto al lado del ID.
[x] Mostrar el UUID completo al hacer hover.
[x] Integrar la función buildUserAgent en el mapeo de la tabla.
[ ] Asegurar que el campo resultante sea una sola string legible en lugar de un objeto JSON.
[ ] Evolución de Búsqueda: Implementar barra de filtros avanzados (sustituyendo o complementando la búsqueda simple).
[ ] Selector de Acciones: Filtro desplegable con tipos de eventos (ej. GAME_RESULT, LOGIN, UPDATE_PROFILE).
[ ] Date Range Picker: Selector de rango de fechas para consultas históricas.
[ ] Filtro de Resultados: Lógica de filtro basada en el campo payout (Ganado vs. Perdido).
[ ] Alineación de Tablas: Corregir el padding y alignment de las celdas para que coincidan perfectamente con los encabezados.
[x] Crear componente Badge para roles.
[x] Configurar colores: Admin (Azul suave / Indigo), User (Gris / Slate).
[x] Redimensionar el botón "Clear search".
[x] Integrarlo como un icono de "X" dentro del propio input field.
[ ] Mover el botón "Create new user" a la parte superior derecha de la sección (encima de la tabla).
[ ] Reubicar "View logs" como una pestaña de navegación o un botón de acción contextual, eliminando botones flotantes innecesarios.

### Sugerencia UUIDs

```jsx
const TruncatedId = ({ id }) => (
  <div>
    <span>{`${id.slice(0, 4)}...${id.slice(-4)}`}</span>
    <button onClick={() => navigator.clipboard.writeText(id)}>
      <CopyIcon size={14} />
    </button>
  </div>
)
```
