@echo off
setlocal

if not exist .env exit /b 1

for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    set %%a=%%b
)

set CURRENT_UID=1000
set CURRENT_GID=1000

if "%1"=="dev" goto :modo_dev
if "%1"=="prod" goto :modo_prod
if "%1"=="stop" goto :modo_stop
goto :fin

:modo_dev
docker-compose -f docker-compose.dev.yml up -d --build
echo Frontend: http://localhost:5173
echo Backend: http://localhost:%API_PORT%
goto :fin

:modo_prod
cd frontend && call npm install && call npm run build && cd ..
docker-compose up -d --build
echo Frontend: http://localhost:80
goto :fin

:modo_stop
docker-compose -f docker-compose.dev.yml down
docker-compose down
echo Intentando liberar RAM...
powershell -Command "Start-Process wsl -ArgumentList '--shutdown' -Verb RunAs"
goto :fin

:fin
pause