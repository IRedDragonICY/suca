@echo off
title SUCA - Modern Subnet Calculator (Headless Desktop)
color 0A
echo.
echo ========================================================
echo   SUCA - Modern Subnet Calculator (Headless Desktop)
echo   Material You Design - Professional Network Tools
echo ========================================================
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

REM Check if dependencies are installed
echo [2/4] Checking dependencies...
if not exist node_modules (
    echo [INFO] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Dependencies are already installed
)

REM Build the React app if build folder doesn't exist or is outdated
echo [3/4] Preparing application...
if not exist build (
    echo [INFO] Building the application for production...
    npm run build
    if errorlevel 1 (
        echo [ERROR] Failed to build application.
        pause
        exit /b 1
    )
    echo [OK] Application built successfully
) else (
    echo [OK] Application is ready
)

echo [4/4] Launching SUCA Desktop (Headless Mode)...
echo.
echo ========================================================
echo   Launching Modern Material You Desktop Application
echo   - Headless window (no system chrome)
echo   - Modern Material You Google design
echo   - Professional network calculation tools
echo ========================================================
echo.
echo [INFO] You can close this console window once SUCA opens
echo [INFO] To stop SUCA, close the application window
echo.

REM Start the Electron app in headless mode
npm run start:electron

REM If we get here, the app has closed
echo.
echo [INFO] SUCA Desktop has been closed.
echo Thank you for using SUCA!
timeout /t 3 >nul 