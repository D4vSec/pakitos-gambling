# Pakitos Gambling

Pakitos Gambling is a **simulated online casino** developed as a final project for the **Higher Degree in Web Application Development (DAW) in Web Application Development (FP DAW)**.

It is a full-stack web application with a React frontend, an Express backend, PostgreSQL as the database, and Docker-based environments for both development and deployment.

## Overview

This repository contains the full application stack and the supporting infrastructure needed to run it locally. The project is organized around:
- **frontend** built with React and Vite
- **backend API** built with Node.js and Express
- **PostgreSQL database**
- **Docker Compose** workflows for development and production
- **pgAdmin** for database management

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, GSAP, React Router |
| Backend | Node.js, Express, JWT, Argon2, Zod |
| Database | PostgreSQL |
| DevOps | Docker, Docker Compose, Apache, pgAdmin |

## Getting Started

### Prerequisites
- Docker
- Docker Compose
- A configured `.env` file in the project root

> [!NOTE]
> On Windows, this project should be run with **WSL2** to avoid compatibility issues.

### Start in development mode

Grant execution permissions to the startup script if needed:

```bash
chmod +x start.sh
```

Run the development environment:

```bash
bash start.sh dev
```

Available services in development:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000` (or the port configured in `.env`)
- pgAdmin: `http://localhost:5050` by default

### Start in production mode

Run the production setup:

```bash
bash start.sh
```

In this mode, the frontend is built as static assets and served through Apache.

## Local Environments

### Development

The development stack is defined in `docker-compose.dev.yml` and includes:

- a Vite frontend with live reloading
- an Express backend container
- PostgreSQL
- pgAdmin

### Production

The production stack is defined in `docker-compose.yml` and includes:

- a static frontend served by Apache
- the backend API
- PostgreSQL
- pgAdmin

## Resource Management on Windows

If Docker resources remain allocated inside WSL2 after use, you can shut the environment down with:

```powershell
powershell -Command "Start-Process wsl -ArgumentList '--shutdown' -Verb RunAs"
```

## Team

- [David Gonzalez](https://github.com/D4vSec)
- [Yeray Caturla](https://github.com/yeraox)
- [Nain Pontes](https://github.com/Stevankito)
- [Alexandro Stefan Dezso](https://github.com/Roria1324)
