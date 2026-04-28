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

if [ "$MODE" = "dev" ]; then
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