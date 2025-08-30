@echo off
echo Deploying Fineo to Vercel...
echo.

echo Step 1: Installing Vercel CLI (if not installed)...
npm list -g vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI already installed.
)

echo.
echo Step 2: Building the project...
npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Vercel...
echo Please follow the prompts:
echo - Set up and deploy? Y
echo - Which scope? (select your account)
echo - Link to existing project? N (for first deployment)
echo - Project name: fineo
echo - Directory: ./
echo - Override settings? N
echo.

vercel --prod

echo.
echo ✅ Deployment complete!
echo.
echo Don't forget to:
echo 1. Set environment variables in Vercel dashboard
echo 2. Configure your custom domain (optional)
echo 3. Test all features
echo.
echo Your app should be live at: https://fineo.vercel.app (or your custom URL)
echo.
pause
