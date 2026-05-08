#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
	echo "Error: .env file not found."
	exit 1
fi

if [ $# -lt 3 ] || [ $# -gt 5 ]; then
	echo "Usage: $0 <username> <email> <password> [role=user] [mode=prod|dev]"
	exit 1
fi

USERNAME="$1"
EMAIL="$2"
PASSWORD="$3"
ROLE="${4:-user}"
MODE="${5:-prod}"

case "$ROLE" in
user|admin)
	;;
*)
	echo "Error: invalid role '$ROLE'. Use 'user' or 'admin'."
	exit 1
	;;
esac

case "$MODE" in
prod)
	COMPOSE_FILE="docker-compose.yml"
	;;
dev)
	COMPOSE_FILE="docker-compose.dev.yml"
	;;
*)
	echo "Error: invalid mode '$MODE'. Use 'prod' or 'dev'."
	exit 1
	;;
esac

set -a
source .env
set +a

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
	COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
	COMPOSE=(docker-compose)
else
	echo "Error: docker compose is required."
	exit 1
fi

export NEW_USER_USERNAME="$USERNAME"
export NEW_USER_EMAIL="$EMAIL"
export NEW_USER_PASSWORD="$PASSWORD"
export NEW_USER_ROLE="$ROLE"

echo "Creating user in $MODE environment..."

"${COMPOSE[@]}" -f "$COMPOSE_FILE" run --rm -T \
	-e NEW_USER_USERNAME \
	-e NEW_USER_EMAIL \
	-e NEW_USER_PASSWORD \
	-e NEW_USER_ROLE \
	backend node --input-type=module <<'NODE'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const username = process.env.NEW_USER_USERNAME
const email = process.env.NEW_USER_EMAIL
const password = process.env.NEW_USER_PASSWORD
const role = process.env.NEW_USER_ROLE ?? 'user'

if (!username || !email || !password) {
	throw new Error('Missing user data.')
}

const modelCandidates = [
	path.resolve(process.cwd(), 'src/models/user.model.js'),
	path.resolve(process.cwd(), 'src/models/userModel.js'),
]

const modelPath = modelCandidates.find((candidate) => existsSync(candidate))
if (!modelPath) {
	throw new Error('User model file not found in container.')
}

const { default: User } = await import(pathToFileURL(modelPath).href)
const userId = await User.createUser({ username, email, password })

if (role !== 'user') {
	const updated = await User.updateUser(userId, { role })
	if (!updated) {
		throw new Error(`Failed to update role for user ${userId}`)
	}
}

console.log(`Created user ${username} <${email}> with role ${role} (id: ${userId})`)
NODE
