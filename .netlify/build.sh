#!/bin/bash

# Netlify build script for Karthikeya Games Galaxy
echo "🎮 Building Karthikeya Games Galaxy..."

# Navigate to frontend directory
cd frontend

# Clean up any npm artifacts that might interfere
echo "🧹 Cleaning up build environment..."
rm -f package-lock.json
rm -rf node_modules/.cache

# Install dependencies with yarn
echo "📦 Installing dependencies..."
yarn install --network-timeout 100000

# Build the project
echo "🔨 Building React application..."
yarn build

echo "✅ Build completed successfully!"
echo "📊 Build artifacts ready in frontend/build/"