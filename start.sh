#!/bin/bash
set -e

echo "==> Running database migrations..."
pnpm --filter @workspace/db run push-force

echo "==> Starting server..."
exec node artifacts/api-server/dist/index.mjs
