#!/bin/sh

set -e

VERSION=$(jq -r .version package.json)

echo "Building version $VERSION"
npm ci
echo "Cleaning dist folder"
sudo rm -rf dist
echo "Building API"
npm run build
echo "Packing API"
tar -czf api.tar.gz dist package.json package-lock.json deploy.sh prisma prisma.config.ts node_modules
echo "Done"
echo "You can now deploy api.tar.gz to your server and extract it there."