#!/bin/bash
# Run stack with seed
set -e

cd "$(dirname "$0")/.."

echo "Starting stack with initial seed..."
docker compose up -d postgres
sleep 5
docker compose --profile seed up seed
docker compose up -d api web
echo "Stack running. Access via SSH tunnel at http://localhost:5173"
