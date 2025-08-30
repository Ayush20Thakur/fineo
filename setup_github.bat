@echo off
echo Setting up GitHub repository for Fineo...
echo.

echo Please follow these steps:
echo 1. Go to https://github.com and create a new repository named "fineo"
echo 2. DO NOT initialize with README, .gitignore, or license
echo 3. Copy the repository URL (it should be: https://github.com/YOUR_USERNAME/fineo.git)
echo.

set /p username="Enter your GitHub username: "
set repo_url=https://github.com/%username%/fineo.git

echo.
echo Adding remote origin: %repo_url%
git remote add origin %repo_url%

echo.
echo Setting main branch and pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo Your project is now available at: https://github.com/%username%/fineo
echo.
pause
