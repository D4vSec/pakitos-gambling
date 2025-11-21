# Guía de Contribución

Para mantener un repositorio limpio y profesional, sigue las siguientes convenciones y pasos.

## Convenciones de Código

Se recomienda seguir [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial de commits claro y estructurado.

| Tipo          | Descripción                                                         |
| ------------- | ------------------------------------------------------------------- |
| **feat:**     | Nueva funcionalidad                                                 |
| **fix:**      | Corrección de errores                                               |
| **docs:**     | Cambios en documentación                                            |
| **style:**    | Formato, estilo, puntos y comas, sin afectar lógica                 |
| **refactor:** | Refactorización de código sin añadir funcionalidad ni corregir bugs |
| **test:**     | Añadir o modificar pruebas                                          |
| **chore:**    | Cambios en tareas de build, configuración, scripts                  |
| **perf:**     | Mejoras de rendimiento                                              |
| **build:**    | Cambios que afectan el sistema de build o dependencias              |

**Ejemplo de commit:**

```
feat: añadir sistema de bonos para usuarios
fix: corregir cálculo de saldo en blackjack
docs: actualizar README con guía de despliegue
style: formatear código según reglas de ESLint
refactor: optimizar función de validación de apuestas
test: añadir pruebas unitarias para módulo de pago
chore: actualizar dependencias en package.json
chore: renombrar variables de entorno en .env
chore: eliminar archivos obsoletos del proyecto
chore: ajustar configuración de docker-compose.yml
```

### Breaking Changes

Los **BREAKING CHANGES** se indican con un **!** después del tipo o con BREAKING CHANGE: en el cuerpo del commit.

**Ejemplos:**

```
feat!: eliminar soporte para API v1
refactor!: cambiar estructura de la base de datos
```

```
feat: migrar a nueva arquitectura de microservicios

BREAKING CHANGE: La API ahora requiere autenticación JWT en todos los endpoints
```

## Versionado Semántico (SemVer)

Seguimos Semantic Versioning `MAJOR.MINOR.PATCH` (e.g., 1.2.3):

```
v1.2.3
 │ │ └─── PATCH: fixes backwards-compatible
 │ └───── MINOR: nuevas features backwards-compatible
 └─────── MAJOR: breaking changes
```

### Cómo se versiona:

| Tipo de Cambio         | Incremento | Ejemplo       | Descripción                                    |
| ---------------------- | ---------- | ------------- | ---------------------------------------------- |
| Breaking Change        | MAJOR      | 1.2.3 → 2.0.0 | Cambios incompatibles con versiones anteriores |
| Nueva Feature (feat)   | MINOR      | 1.2.3 → 1.3.0 | Funcionalidades nuevas compatibles             |
| Bug Fix (fix)          | PATCH      | 1.2.3 → 1.2.4 | Corrección de errores                          |
| Otros (docs, chore...) | PATCH      | 1.2.3 → 1.2.4 | Mejoras internas                               |

### Flujo de Versiones y Releases

#### Etapas de Release:

| Etapa / Rama      | Versión / Estado | Descripción                          |
| ----------------- | ---------------- | ------------------------------------ |
| feature/          | N/A              | Desarrollo de nuevas funcionalidades |
| develop           | N/A              | Integración de features en testing   |
| Release Candidate | v1.1.0-rc.1      | Pruebas antes de versión estable     |
| Stable            | v1.0.0 / v1.1.0  | Versión estable del proyecto         |

#### Tipos de Pre-releases:

| Tipo de Pre-release | Versión        | Descripción                                    |
| ------------------- | -------------- | ---------------------------------------------- |
| Release Candidate   | v1.2.0-rc.1    | Release Candidate 1 (pruebas antes de estable) |
| Release Candidate   | v1.2.0-rc.2    | Release Candidate 2                            |
| Beta                | v1.2.0-beta.1  | Beta 1 (pruebas tempranas)                     |
| Alpha               | v1.2.0-alpha.1 | Alpha 1 (desarrollo interno)                   |

#### Ejemplo de Evolución de Versiones:

| Versión       | Tipo / Estado                   | Descripción                              |
| ------------- | ------------------------------- | ---------------------------------------- |
| v1.0.0        | Estable                         | Versión estable inicial                  |
| v1.0.1        | Patch / Fix crítico             | Corrección de errores críticos           |
| v1.1.0-rc.1   | Pre-release / Release Candidate | Nueva feature en testing                 |
| v1.1.0        | Minor / Feature estable         | Nueva feature estable                    |
| v1.1.1        | Patch / Fix menor               | Corrección de errores menores            |
| v1.2.0-beta.1 | Pre-release / Beta              | Más features en beta                     |
| v2.0.0-rc.1   | Pre-release / Breaking change   | Breaking changes en testing              |
| v2.0.0        | Major / Breaking change         | Nueva major version con breaking changes |

## Configuración del Entorno

**1. Clonar el repositorio:**

```bash
git clone https://github.com/D4vSec/pakitos-gambling.git
cd pakitos-gambling
```

**2. Copiar archivo de entorno:**

```bash
cp .env.example .env
```

**3. Levantar contenedores:**

```bash
chmod +x ./build-and-run.sh
./build-and-run.sh
```
