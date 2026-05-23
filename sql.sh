set -e

if [ ! -f .env ]; then
    echo "Error: .env file not found."
    exit 1
fi

set -a
source .env
set +a

CONTAINER="postgres_db"

echo "Executing SQL script on $CONTAINER..."

docker exec -i \
    -e PGPASSWORD="${DB_PASSWORD}" \
    "$CONTAINER" \
    psql \
        -h "localhost" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -v ON_ERROR_STOP=1 \
    < ./sql/pakitos.sql

echo "Database update completed successfully."