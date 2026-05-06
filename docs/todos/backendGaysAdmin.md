# 📊 Especificación de Filtros

## 🎯 Objetivo

Implementar un sistema de filtrado flexible que permita consultar y organizar la información de manera eficiente en logs, auditorías y transacciones.

---

## 🔎 Filtros requeridos

### 📅 Filtro por fechas

Permitir filtrar resultados en base a rangos temporales:

- Rango entre dos fechas (`from` - `to`)
- Desde una fecha específica (`from`)
- Hasta una fecha específica (`to`)

---

### ↕️ Ordenación

Permitir ordenar cualquier campo disponible:

- Orden ascendente (`ASC`)
- Orden descendente (`DESC`)

---

### 🧩 Filtro por tipo

Permitir filtrado por múltiples valores simultáneamente:

- Tipo de usuario
- Tipo de transacción
- Tipo de evento de auditoría

**Nota:**  
Este filtro debería poder implementarse indicando la columna correspondiente y uno o varios valores (multi-select).

---

### ➕ Propuestas adicionales

- **Búsqueda por texto libre**
  - Permitir buscar por campos como `userId`, `email`, `id de transacción`, etc.

- **Paginación**
  - Limitar resultados con `limit` y `offset` o paginación por páginas.

- **Filtrado por rango de importe**
  - Especialmente útil en transacciones (`minAmount` - `maxAmount`).

- **Filtrado por estado**
  - Ej: éxito, fallo, pendiente.

- **Selección de columnas**
  - Permitir elegir qué campos devolver para optimizar la respuesta.

---

## 📝 Anotaciones

- Se han detectado acciones que no aparecen en los logs.
  - En auditoria solo se observan:
    - `ADMIN_ACTION`
    - `GAME_RESULT`
  - En transacciones:
    - No aparecen ciertos eventos esperados
    - Solo se registran:
      - `WIN`
      - `BET`
      - `DEPOSIT`

---

## ✅ Checklist

- [ ] Implementar filtro por rango de fechas
- [ ] Implementar ordenación ASC/DESC en cualquier campo
- [ ] Implementar filtro por tipo (usuario, transacción, auditoría) con soporte multi-select
- [ ] Implementar búsqueda por texto libre
- [ ] Implementar paginación
- [ ] Implementar filtro por rango de importe
- [ ] Implementar filtro por estado
- [ ] Permitir selección de columnas en la respuesta
- [ ] Revisar y completar eventos faltantes en logs
