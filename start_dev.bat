@echo off
echo Starting Nova Financial Glow Development Environment...
echo.

echo Step 1: Installing Python dependencies...
pip install -r api_requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Starting Python API server...
start "Python API Server" cmd /k "python api_server.py"

echo.
echo Step 4: Starting React development server...
start "React App" cmd /k "npm run dev"

echo.
echo Development environment started!
echo - React app: http://localhost:5173
echo - Python API: http://localhost:8000
echo.
echo Press any key to exit...
pause
