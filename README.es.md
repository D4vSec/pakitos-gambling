# 🎰 Pakitos Gambling
<p align="center">
  <a href="https://github.com/D4vSec/pakitos-gambling/blob/main/README.md">🇬🇧 English</a> •
  <a href="https://github.com/D4vSec/pakitos-gambling/blob/main/README.es.md">🇪🇸 Español</a>
</p>

Pakitos Gambling es un **casino en línea simulado** desarrollado como proyecto final del **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**.

Es una aplicación web full-stack con frontend en React, backend en Express, PostgreSQL como base de datos y entornos basados en Docker para desarrollo y despliegue.


## 📋 Descripción general
Este repositorio contiene la pila completa de la aplicación y la infraestructura necesaria para ejecutarla localmente. El proyecto está organizado en:

- **frontend** construido con React y Vite
- **API backend** construida con Node.js y Express
- **Base de datos PostgreSQL**
- **Workflows de Docker Compose** para desarrollo y producción
- **pgAdmin** para la gestión de la base de datos

# 🛠️ Stack tecnológico
| Área | Tecnologías |
| --- | --- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white) ![Argon2](https://img.shields.io/badge/Argon2-6495ED?style=for-the-badge&logo=auth0&logoColor=white) |
| **Base de datos** | ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

## 🚀 Puesta en marcha
### Requisitos previos
- Node.js (recomendado LTS) y npm (o pnpm/yarn)
- Git
- Docker y Docker Compose para la pila de desarrollo completa
- Se recomienda WSL2 si estás en Windows

### Variables de entorno
Copia `.env.example` a `.env` en la raíz del repositorio y establece los valores necesarios

```bash
cp .env.example .env
```

### Configuración de CORS
El backend lee `CORS_ORIGIN` desde el archivo `.env` para configurar el middleware de cors.

```env
CORS_ORIGIN=http://localhost:5173
```

> [!TIP]
> Después de cambiar CORS_ORIGIN, siempre reinicia el contenedor del backend para que los cambios surtan efecto.

### Iniciar contenedores
Desde la raíz del repositorio:

```bash
bash start.sh
```

> El modo se lee de `NODE_ENV` en `.env` (`development` o `production`)

### Base de datos
Importa el esquema inicial:

```bash
bash sql.sh
```

### Ejecutar el backend sin Docker
Si quieres ejecutar el backend de forma local sin Docker, debes asegurarte de estar utilizando Node.js 22. Recomendamos usar nvm para gestionar las versiones de Node. El proyecto incluye un archivo `.nvmrc` dentro de la carpeta `backend` que especifica la versión exacta de Node requerida para este proyecto.
```bash
nvm install
nvm use
```

## 🐛 Solución de problemas
### Retorno de carro (`\r`) en scripts bash
Si encuentras errores con `\r` (retorno de carro) al ejecutar scripts en Linux, corrige los finales de línea con:
```bash
sed -i 's/\r$//' start.sh
```

### Docker
Si los contenedores no se inician o la API responde con `500`, puedes revisar los logs de Docker usando:
```bash
docker compose logs -f <container>
```

### Base de datos
- Asegúrate de que PostgreSQL esté en ejecución.
- Verifica que todas las credenciales y detalles de conexión en tu archivo `.env` sean correctos.
- Comprueba los logs de los contenedores

## 🐋 Gestión de recursos en Windows
Si los recursos de Docker quedan asignados dentro de WSL2 después de su uso, puedes apagar el entorno con:

```powershell
powershell -Command "Start-Process wsl -ArgumentList '--shutdown' -Verb RunAs"
```

## 👥 Equipo
- [David Gonzalez](https://github.com/D4vSec)
- [Yeray Caturla](https://github.com/yeraox)
- [Nain Pontes](https://github.com/Stevankito)
- [Alexandro Stefan Dezso](https://github.com/Roria1324)
