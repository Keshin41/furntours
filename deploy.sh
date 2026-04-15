#!/bin/bash

set -e

VERSION=$(jq -r .version package.json)

echo "Deploying version $VERSION"
echo "Stopping API"
pm2 stop api || true
echo "Extracting API package"
tar -xzf api.tar.gz -C .
echo "Running database migrations"
npx prisma migrate status
npx prisma migrate deploy
echo "Starting API"
pm2 start dist/src/main.js --name api
echo "Done"


