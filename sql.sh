#!/bin/bash
set -e

if [ ! -f .env ]; then
    echo "Error: .env file not found."
    exit 1
fi

set -a
source .env
set +a

MODE="${1:-prod}"
CONTAINER="postgres_db"

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
                echo "Production deployment blocked."
                echo "One of your .env variables is using an insecure default value: '$val'"
                exit 1
            fi
        done
    done
else
    CONTAINER="postgres_db_dev"
fi

echo "Executing SQL script on $CONTAINER..."

docker exec -i \
    -e PGPASSWORD="${DB_PASSWORD}" \
    "$CONTAINER" \
    psql \
        -h "${DB_HOST:-localhost}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -v ON_ERROR_STOP=1 \
    < ./sql/pakitos.sql

echo "Database update completed successfully."