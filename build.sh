#!/bin/bash
set -e

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building React frontend..."
BASE_PATH=/ PORT=3000 NODE_ENV=production pnpm --filter @workspace/our-places run build

echo "==> Building Express API server..."
pnpm --filter @workspace/api-server run build

echo "==> Copying frontend build into API server dist..."
cp -r artifacts/our-places/dist/public artifacts/api-server/dist/public

echo "==> Build complete!"
