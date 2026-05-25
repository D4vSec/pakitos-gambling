# Emojis prohibidos en frontend

## Scope

Barrido realizado sobre `frontend/` para localizar emojis que deben ser sustituidos por iconos SVG o texto plano.

## Hallazgos

### UI visible

- `frontend/src/components/games/slots/SlotControls.jsx:180`
  - Usa `⏳` y `🎰` en el texto del botón de spin.
  - Actual: `{isBusy ? "⏳" : \`🎰 ${t("games.slots.controls.spin")}\`}`
  - Propuesta:
    - `⏳` -> icono de loading/spinner
    - `🎰` -> icono SVG de slots o play

- `frontend/src/components/games/slots/SlotControls.jsx:202`
  - Usa `⏳` y `🎰` en el segundo botón de spin.
  - Actual: `{isBusy ? "⏳" : \`🎰 ${t("games.slots.controls.spin")}\`}`
  - Propuesta:
    - `⏳` -> icono de loading/spinner
    - `🎰` -> icono SVG de slots o play

### Comentarios internos

- `frontend/src/components/games/GameScreen.jsx:18`
  - Emoji detectado: `👇`
  - Actual: `/* 👇 ESTO NO SE TOCA */`
  - Propuesta: `/* ESTO NO SE TOCA */`

- `frontend/src/components/games/roulette/roulettes/RouletteWheel.jsx:90`
  - Emoji detectado: `👈`
  - Actual: `// 👈 ajuste fino visual`
  - Propuesta: `// ajuste fino visual`

- `frontend/src/components/notification/Notification.jsx:24`
  - Emoji detectado: `🎬`
  - Actual: `// 🎬 entrada`
  - Propuesta: `// entrada`

- `frontend/src/pages/Profile.jsx:93`
  - Emoji detectado: `🔵`
  - Actual: `/* 🔵 PERFIL */`
  - Propuesta: `/* PERFIL */`

- `frontend/src/pages/Profile.jsx:162`
  - Emoji detectado: `🟡`
  - Actual: `/* 🟡 SEGURIDAD */`
  - Propuesta: `/* SEGURIDAD */`

- `frontend/src/pages/Profile.jsx:217`
  - Emoji detectado: `🔴`
  - Actual: `/* 🔴 DANGER ZONE */`
  - Propuesta: `/* DANGER ZONE */`

## No contado como emoji estricto

- `frontend/src/components/layout/Footer.jsx:10`
  - Símbolo detectado: `©`
  - No es un emoji funcional de UI como tal, pero sí un símbolo Unicode.
  - Revisar solo si se quiere una política de ASCII/iconos más estricta.

## Resumen

- Emojis reales detectados: **8**
- Casos visibles para usuario: **2**
- Casos en comentarios: **6**
- Locales con emojis: **0**

## Checklist

- [ ] Sustituir `⏳` por icono de loading en botones de slots
- [ ] Sustituir `🎰` por icono SVG en botones de slots
- [ ] Limpiar emojis en comentarios de `GameScreen.jsx`
- [ ] Limpiar emojis en comentarios de `RouletteWheel.jsx`
- [ ] Limpiar emojis en comentarios de `Notification.jsx`
- [ ] Limpiar emojis en comentarios de `Profile.jsx`
