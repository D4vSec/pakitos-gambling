# Pakitos Gambling

Proyecto de un casino online simulado desarrollado como Trabajo de Fin de Grado (TFG) del ciclo superior Desarrollo de Aplicaciones Web (DAW).

## Integrantes

- [Alexandro Stefan Dezso](https://github.com/Roria1324)
- [David González](https://github.com/D4vSec)
- [Nain Pontes](https://github.com/Stevankito)
- [Yeray Caturla](https://github.com/yeraox)

## Stack Tecnológico

| Área          | Tecnologías                                   |
| ------------- | --------------------------------------------- |
| Frontend      | React, TailwindCSS, GSAP, React Router, Axios |
| Backend       | NodeJS, Express, JWT, Crypto                  |
| Base de datos | PostgreSQL                                    |
| DevOps        | Docker, Docker Compose                        |

## Instalación y Despliegue

Para facilitar el desarrollo y el despliegue, el proyecto está completamente dockerizado.

### Modo Desarrollo

**Windows**

```ps1
./start.bat dev
```

**Linux**

```bash
bash start.sh dev
```

### Modo Producción

**Windows**

```ps1
./start.bat prod
```

**Linux**

```bash
bash start.sh
```

### Gestión de Recursos (WSL2)
En Windows, se incluye el comando `./start.bat stop` para parar los contenedores y finalizar el proceso de docker para que no se este comiendo la RAM.
