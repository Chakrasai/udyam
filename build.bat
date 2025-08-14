@echo off
REM Build script for Windows deployment

echo 🚀 Starting build process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
if exist "yarn.lock" (
    echo Using Yarn...
    yarn install --frozen-lockfile
) else (
    echo Using NPM...
    npm ci
    if errorlevel 1 npm install
)

REM Build frontend
echo 🏗️ Building frontend...
cd frontend

if exist "yarn.lock" (
    yarn install --frozen-lockfile
    yarn build
) else (
    npm ci
    if errorlevel 1 npm install
    npm run build
)

cd ..

echo ✅ Build completed successfully!
echo 📂 Frontend built in frontend/dist/
