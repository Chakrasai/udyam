#!/bin/bash

# Build script for deployment platforms
set -e

echo "🚀 Starting build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null && [ -f "yarn.lock" ]; then
    echo "Using Yarn..."
    yarn install --frozen-lockfile
elif command -v npm &> /dev/null; then
    echo "Using NPM..."
    npm ci || npm install
else
    echo "❌ Error: Neither npm nor yarn found."
    exit 1
fi

# Build frontend
echo "🏗️ Building frontend..."
cd frontend

if command -v yarn &> /dev/null && [ -f "yarn.lock" ]; then
    yarn install --frozen-lockfile
    yarn build
else
    npm ci || npm install
    npm run build
fi

cd ..

echo "✅ Build completed successfully!"
echo "📂 Frontend built in frontend/dist/"
