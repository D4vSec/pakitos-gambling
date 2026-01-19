#!/bin/bash
if [ ! -f .env ]; then
    echo "Error: No se encuentra el fichero .env"
    exit 1
fi

set -a
source .env
set +a

export CURRENT_UID=$(id -u 2>/dev/null || echo 1000)
export CURRENT_GID=$(id -g 2>/dev/null || echo 1000)

if [ "$1" == "dev" ]; then
    echo "--- MODO DESARROLLO (HOT RELOAD ACTIVO) ---"
    docker-compose -f docker-compose.dev.yml up -d --build

    echo -e "\n¡Entorno de desarrollo listo!"
    echo "Frontend (Vite): http://localhost:5173"
    echo "Backend API: http://localhost:${API_PORT}"
    echo "Para ver logs en tiempo real: docker-compose -f docker-compose.dev.yml logs -f"
else
    echo "--- MODO PRODUCCIÓN (APACHE) ---"
    
    echo "Construyendo frontend estático..."
    cd frontend
    npm run build
    cd ..

    echo "Levantando contenedores de producción..."
    docker-compose up -d --build

    echo -e "\n¡Aplicación en producción lista!"
    echo "Frontend (Apache): http://localhost:80"
    echo "Backend API: http://localhost:${API_PORT}"
fi