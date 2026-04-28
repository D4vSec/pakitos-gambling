# 🎰 Pakitos Gambling
<p align="center">
  <a href="https://github.com/D4vSec/pakitos-gambling/blob/main/README.md">🇬🇧 English</a> •
  <a href="https://github.com/D4vSec/pakitos-gambling/blob/main/README.es.mdd">🇪🇸 Español</a>
</p>

Pakitos Gambling is a **simulated online casino** developed as a final project for the **Higher Degree in Web Application Development (DAW)**.

It is a full-stack web application with a React frontend, an Express backend, PostgreSQL as the database, and Docker-based environments for both development and deployment.

## 📋 Overview
This repository contains the full application stack and the supporting infrastructure needed to run it locally. The project is organized around:
- **frontend** built with React and Vite
- **backend API** built with Node.js and Express
- **PostgreSQL database**
- **Docker Compose** workflows for development and production
- **pgAdmin** for database management

# 🛠️ Tech Stack
| Area | Technologies |
| --- | --- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white) ![Argon2](https://img.shields.io/badge/Argon2-6495ED?style=for-the-badge&logo=auth0&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

## 🚀 Getting Started
### Prerequisites
- Node.js (LTS recommended) and npm (or pnpm/yarn)
- Git
- Docker & Docker Compose for the full development stack
- WSL2 is recommended if you are on Windows

### Environment variables
Copy `.env.example` to `.env` at the repository root and set required values

```bash
cp .env.example .env
```

### CORS Setup
The backend reads `CORS_ORIGIN` from the `.env` file to configure the cors middleware.

```env
CORS_ORIGIN=http://localhost:5173
```

> [!TIP]
> After changing CORS_ORIGIN, always restart the backend container for the changes to take effect.

### Start containers
From the repository root:

```bash
bash start.sh dev
```

### Database
Import the initial schema:

```bash
bash sql.sh
```

## 🐛 Troubleshooting
### Carriage return (`\r`) in bash scripts
If you encounter `\r` (carriage return) errors when running scripts on Linux, fix the line endings with:
```bash
sed -i 's/\r$//' start.sh
```

### Docker
If you encounter that containers doesn't start or API responds with `500` you can check the docker logs using
```bash
docker compose logs -f <container>
```

### Database
- Ensure PostgreSQL is running.
- Double-check that all database credentials and connection details in your `.env` file are correct.
- Verify container logs

## 🐋 Resource Management on Windows
If Docker resources remain allocated inside WSL2 after use, you can shut the environment down with:

```powershell
powershell -Command "Start-Process wsl -ArgumentList '--shutdown' -Verb RunAs"
```

## 👥 Team
- [David Gonzalez](https://github.com/D4vSec)
- [Yeray Caturla](https://github.com/yeraox)
- [Nain Pontes](https://github.com/Stevankito)
- [Alexandro Stefan Dezso](https://github.com/Roria1324)
