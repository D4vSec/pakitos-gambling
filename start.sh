#!/usr/bin/env bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' 

error_exit() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

if [ ! -f .env ]; then
    error_exit ".env file not found. Please create a .env file with the necessary configuration."
fi

set -a
source .env
set +a

export CURRENT_UID=$(id -u 2>/dev/null || echo 1000)
export CURRENT_GID=$(id -g 2>/dev/null || echo 1000)

if docker compose version >/dev/null 2>&1; then
    DOCKER_BE="docker compose"
else
    DOCKER_BE="docker-compose"
fi

if [ "$1" = "dev" ]; then
    echo -e "${BLUE}--- DEVELOPMENT MODE ---${NC}"
    
    $DOCKER_BE -f docker-compose.dev.yml up -d --build || error_exit "Docker compose failed to start."

    echo -e "\n${GREEN}Development environment ready!${NC}"
    echo -e "Frontend (Vite):  ${BLUE}http://localhost:5173${NC}"
    echo -e "Backend API:      ${BLUE}http://localhost:${API_PORT:-3000}${NC}"
    echo -e "To view logs:     ${BLUE}$DOCKER_BE -f docker-compose.dev.yml logs -f${NC}"

else
    echo -e "${GREEN}--- PRODUCTION MODE (APACHE) ---${NC}"
    if [ ! -d "frontend" ]; then
        error_exit "Frontend directory not found."
    fi

    echo "Building static frontend..."
    
    (cd frontend && npm install && npm run build) || error_exit "Frontend build process failed."

    echo "Starting production containers..."
    $DOCKER_BE up -d --build || error_exit "Docker compose failed to start."

    echo -e "\n${GREEN}Production environment ready!${NC}"
    echo -e "Frontend (Apache): ${BLUE}http://localhost:80${NC}"
    echo -e "Backend API:       ${BLUE}http://localhost:${API_PORT:-3000}${NC}"
fi