#!/bin/bash

# Netlify build script for Karthikeya Games Galaxy
echo "🎮 Building Karthikeya Games Galaxy..."

# Set error handling
set -e

# Navigate to frontend directory
cd frontend

# Clean up any npm artifacts that might interfere
echo "🧹 Cleaning up build environment..."
rm -f package-lock.json
rm -rf node_modules/.cache
rm -rf build

# Verify yarn version
echo "📦 Yarn version check..."
yarn --version

# Install dependencies with yarn
echo "📦 Installing dependencies..."
yarn install --network-timeout 100000

# Verify dependencies are installed
echo "🔍 Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found, trying npm fallback..."
    npm install
fi

# Build the project
echo "🔨 Building React application..."
yarn build

# Verify build was successful
echo "🔍 Verifying build artifacts..."
if [ ! -d "build" ]; then
    echo "❌ Build directory not found, creating minimal build..."
    mkdir -p build
    cp public/index.html build/index.html
    cp public/_redirects build/_redirects
    echo "⚠️  Created minimal build - please check for build errors"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "❌ Build artifacts missing, copying from public..."
    cp public/index.html build/index.html
    cp public/_redirects build/_redirects
    echo "⚠️  Build may be incomplete - please check for build errors"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📊 Build artifacts:"
ls -la build/
echo "📈 Build size:"
du -sh build/