#!/bin/bash

# Validate Netlify build artifacts
echo "🔍 Validating Netlify build artifacts..."

BUILD_DIR="/app/frontend/build"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found: $BUILD_DIR"
    exit 1
fi

# Check for essential files
REQUIRED_FILES=(
    "index.html"
    "asset-manifest.json"
    "_redirects"
    ".htaccess"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Check for static assets
if [ ! -d "$BUILD_DIR/static" ]; then
    echo "❌ Static assets directory not found"
    exit 1
fi

if [ ! -d "$BUILD_DIR/static/js" ]; then
    echo "❌ JavaScript assets directory not found"
    exit 1
fi

if [ ! -d "$BUILD_DIR/static/css" ]; then
    echo "❌ CSS assets directory not found"
    exit 1
fi

echo "✅ Found static assets directory"

# Check file sizes
INDEX_SIZE=$(stat -c%s "$BUILD_DIR/index.html")
if [ "$INDEX_SIZE" -lt 1000 ]; then
    echo "⚠️  Warning: index.html seems very small ($INDEX_SIZE bytes)"
fi

echo "✅ All build artifacts validated successfully!"
echo "📊 Build summary:"
echo "  - Build directory: $BUILD_DIR"
echo "  - Index.html size: $INDEX_SIZE bytes"
echo "  - Static assets: $(find "$BUILD_DIR/static" -type f | wc -l) files"
echo "  - Total build size: $(du -sh "$BUILD_DIR" | cut -f1)"