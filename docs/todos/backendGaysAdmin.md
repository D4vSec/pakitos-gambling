---
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
- O sin ordenación

---

### 🧩 Filtro por tipo

Permitir filtrado por múltiples valores simultáneamente. En sentido de que sea como una búsqueda global, pero yo en el front ps pongo un regex y dependiendo de lo escrito ya te indico si es la columna del uuid, de la ip, del balance etc. Porque lo suyo seria reutilizarlo, no que tu en back tengas una clave por cada posibilidad de filtrar (me explico como el culo)

**Nota:** El filtro yo lo pondría de manera que yo te indico la columna y el valor por el que quiero filtrar para que sea reutilizable, p.ej ("role" - "Admin" para los usuarios y "ip" - "123.123.123.123" para los logs) ).
**Nota-2:** Ten en cuenta que también necesito filtros para la tabla de las transacciones y de todos los usuarios, por lo que montalo como te sea más cómodo

---

### ➕ Propuestas adicionales

- **Filtrado por rango de importe**
- Especialmente útil en transacciones (`minAmount` - `maxAmount`). (Para las transacciones del usuario)

---

## ❌ Errores Identificados (Bugs)

### 🔴 Fallo crítico en filtro de UUID (`user_id`)

Se ha detectado un error de sintaxis en la base de datos cuando se intenta filtrar por un `user_id` que no cumple con el formato estándar de UUID. El backend intenta ejecutar la consulta directamente, provocando una excepción en PostgreSQL. (ns is es fallo mio, te lo he enviado como "userId=4e02806f-1894-4df6-bebb-dd78465a380e")

**Evidencia:**

```bash
postgres_db_dev | ERROR: invalid input syntax for type uuid: "4"
postgres_db_dev | STATEMENT: SELECT COUNT(*)::int AS count FROM audit_logs WHERE user_id = $1
backend_dev      | [15:07:08.488] ERROR (32): invalid input syntax for type uuid: "4"
backend_dev      |     err: {
backend_dev      |       "type": "DatabaseError",
backend_dev      |       "message": "invalid input syntax for type uuid: \"4\"",
backend_dev      |       "stack":
backend_dev      |           error: invalid input syntax for type uuid: "4"
backend_dev      |               at /app/node_modules/pg-pool/index.js:45:11
backend_dev      |               at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
backend_dev      |               at async Object.countAuditLogs (file:///app/src/models/audit.model.js:41:20)
backend_dev      |               at async Object.countAuditLogs (file:///app/src/services/audit.service.js:46:48)
backend_dev      |               at async getAuditLogs (file:///app/src/controllers/audit.controller.js:50:17)
backend_dev      |       "length": 133,
backend_dev      |       "name": "error",
backend_dev      |       "severity": "ERROR",
backend_dev      |       "code": "22P02",
backend_dev      |       "where": "unnamed portal parameter $1 = '...'",
backend_dev      |       "file": "uuid.c",
backend_dev      |       "line": "133",
backend_dev      |       "routine": "string_to_uuid"
backend_dev      |     }
```

**Causa:** El campo `user_id` en la tabla `audit_logs` es de tipo `UUID`. Al recibir un string corto o inválido (ej: `"4"`), la conversión falla.

---

## 📝 Anotaciones

- **Validación de Datos:** Es imperativo validar que el `userId` sea un UUID válido en el frontend o backend antes de lanzarlo contra la base de datos para evitar el error `22P02`.
- **Eventos faltantes:** - En logs solo se observan: `ADMIN_ACTION`, `GAME_RESULT`. faltan varios creo
- En transacciones solo se registran: `WIN`, `BET`, `DEPOSIT`, igual, ns si faltará alguno

---

## ✅ Checklist

- [x] Implementar filtro por rango de fechas
- [ ] Implementar ordenación ASC/DESC en cualquier campo
- [ ] Implementar filtro por tipo (usuario, transacción, auditoría) con soporte multi-select
- [ ] **Corregir error de sintaxis UUID:** Validar formato UUID antes de ejecutar la query
- [ ] Implementar filtro por rango de importe
- [ ] Permitir selección de columnas en la respuesta
- [ ] Revisar y completar eventos faltantes en logs
