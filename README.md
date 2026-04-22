# Pakitos Gambling
Project of a simulated online casino developed as a Final Project (TFG) for the Higher Degree in Web Application Development (DAW).

## Team Members
- [David González](https://github.com/D4vSec)
- [Yeray Caturla](https://github.com/yeraox)
- [Nain Pontes](https://github.com/Stevankito)
- [Alexandro Stefan Dezso](https://github.com/Roria1324)

## Tech Stack
| Area          | Technologies                                  |
| ------------- | --------------------------------------------- |
| Frontend      | React, TailwindCSS, GSAP, React Router |
| Backend       | NodeJS, Express, JWT, Crypto                  |
| Database      | PostgreSQL                                    |
| DevOps        | Docker, Docker Compose                        |

## Installation and Deployment
To facilitate development and deployment, the project is fully dockerized. 
> **Note for Windows users:** It is required to use **WSL2** (Windows Subsystem for Linux) to run the project correctly.

### Development Mode
**Linux**
```bash
bash start.sh dev
```

### Production Mode
**Linux**
```bash
bash start.sh
```
### Resource Management (WSL2)
On Windows, the command `powershell -Command "Start-Process wsl -ArgumentList '--shutdown' -Verb RunAs"` stops the containers and terminate the Docker process to prevent it from over-consuming RAM within the WSL2 utility VM.
