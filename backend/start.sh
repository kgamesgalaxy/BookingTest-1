#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

log() {
  printf '%s\n' "$*"
}

log "Starting Karthikeya Games Galaxy backend..."

# Determine port (default 8080)
PORT="${PORT:-8080}"

# Validate PORT is a positive integer
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -le 0 ] 2>/dev/null; then
  log "ERROR: Invalid PORT value: '$PORT'. Must be a positive integer."
  exit 1
fi

# Check optional but important environment variables and provide informative output
if [ -z "${MONGO_URL:-}" ]; then
  log "WARNING: MONGO_URL is not set. The application may fail to connect to the database."
else
  log "MONGO_URL: SET"
fi

if [ -z "${DB_NAME:-}" ]; then
  log "WARNING: DB_NAME is not set."
else
  log "DB_NAME: SET"
fi

# Start the application
log "Launching uvicorn on 0.0.0.0:${PORT}"
exec uvicorn server:app --host 0.0.0.0 --port "$PORT"