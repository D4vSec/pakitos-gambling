#!/usr/bin/env bash
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create a .env file with the necessary database configuration."
    exit 1
fi

set -a
source .env
set +a

export CURRENT_UID=$(id -u 2>/dev/null || echo 1000)
export CURRENT_GID=$(id -g 2>/dev/null || echo 1000)

if [ "$1" = "dev" ]; then
    echo "--- DEVELOPMENT MODE ---"
    docker compose -f docker-compose.dev.yml up -d --build

    echo -e "\nDevelopment environment ready!"
    echo "Frontend (Vite): http://localhost:5173"
    echo "Backend API: http://localhost:${API_PORT}"
    echo "To view real-time logs: docker-compose -f docker-compose.dev.yml logs -f"
else
    echo "--- PRODUCTION MODE (APACHE) ---"
    
    echo "Building static frontend..."
    cd frontend
    npm run build
    cd ..

    echo "Starting production containers..."
    docker-compose up -d --build

    echo -e "\nProduction environment ready!"
    echo "Frontend (Apache): http://localhost:80"
    echo "Backend API: http://localhost:${API_PORT}"
fi