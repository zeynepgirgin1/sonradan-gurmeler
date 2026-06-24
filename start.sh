#!/bin/bash
set -e

echo "==> Running database migrations..."
if pnpm --filter @workspace/db run push-force; then
  echo "==> Migrations completed successfully."
else
  echo "==> WARNING: Migration failed — continuing startup anyway."
fi

echo "==> Starting server..."
exec node artifacts/api-server/dist/index.mjs
