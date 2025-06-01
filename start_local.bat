@echo off
echo Starting Whatzapp Lead Pilot locally...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Navigate to the project directory
cd /d "%~dp0"

:: Check if node_modules exists, if not install dependencies
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
)

:: Start the development server
echo Starting development server...
echo.
echo The application will be available at http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
call npm run dev

pause 