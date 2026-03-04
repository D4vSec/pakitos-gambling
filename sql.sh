#!/bin/bash
if [ ! -f .env ]; then
    echo "Error: No se encuentra el fichero .env"
    exit 1
fi

set -a
source .env
set +a

docker exec -i -e PGPASSWORD="${DB_PASSWORD}" postgres_db_dev \
  psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" < ./sql/user.sql