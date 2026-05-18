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

[ "${NODE_ENV:-production}" = "development" ] && MODE="dev" || MODE="prod"

if [ "$MODE" != "dev" ]; then
    FORBIDDEN_DEFAULTS=(
        "password" "admin" "app"
        "jwt_secret_super_seguro_aqui_123_todo_al_rojo"
        "jwt_secret_super_seguro_aqui_123_todo_al_negro"
        "password_super_secreta"
    )

    CHECK_VARS=("$DB_PASSWORD" "$DB_USER" "$DB_NAME" "$JWT_SECRET" "$REFRESH_SECRET" "$PG_ADMIN_PASSWD")

    for val in "${CHECK_VARS[@]}"; do
        for forbidden in "${FORBIDDEN_DEFAULTS[@]}"; do
            if [[ "$val" == "$forbidden" ]]; then
                error_exit "Production deployment blocked. Insecure default value detected in .env: '$val'"
            fi
        done
    done
fi

if [ "$MODE" = "dev" ]; then
    echo -e "${BLUE}--- DEVELOPMENT MODE ---${NC}"
    $DOCKER_BE --profile dev up -d --build || error_exit "Docker compose failed to start."
    echo -e "\n${GREEN}Development environment ready!${NC}"
    echo -e "Frontend (Vite): ${BLUE}http://localhost:5173${NC}"
    echo -e "Backend API: ${BLUE}http://localhost:${API_PORT:-3000}${NC}"
    echo -e "pgAdmin: ${BLUE}http://localhost:${PGADMIN_PORT:-5050}${NC}"
    echo -e "Logs: ${BLUE}$DOCKER_BE --profile dev logs -f${NC}"
    echo -e "Down: ${BLUE}$DOCKER_BE --profile dev down${NC}"
else
    echo -e "${GREEN}--- PRODUCTION MODE (APACHE) ---${NC}"
    if [ ! -d "frontend" ]; then
        error_exit "Frontend directory not found."
    fi
    echo "Starting production containers..."
    $DOCKER_BE --profile prod up -d --build || error_exit "Docker compose failed to start."
    echo -e "\n${GREEN}Production environment ready!${NC}"
    echo -e "Frontend (Apache): ${BLUE}http://localhost:80${NC}"
    echo -e "Backend API: ${BLUE}http://localhost:${API_PORT:-3000}${NC}"
    echo -e "pgAdmin: ${BLUE}http://localhost:${PGADMIN_PORT:-5050}${NC}"
    echo -e "Logs: ${BLUE}$DOCKER_BE --profile prod logs -f${NC}"
    echo -e "Down: ${BLUE}$DOCKER_BE --profile prod down${NC}"
fi