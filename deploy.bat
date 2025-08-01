@echo off
REM Movie Review App Deployment Script for Windows
REM This script helps deploy both backend and frontend

echo 🚀 Starting Movie Review App Deployment...

REM Check if we're in the right directory
if not exist "movie-review-app" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

if not exist "movie-review-frontend" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

REM Backend deployment
echo [INFO] Deploying Backend...

cd movie-review-app

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Heroku CLI not found. Please install it first:
    echo npm install -g heroku
    echo heroku login
    exit /b 1
)

REM Check if Heroku app exists
heroku apps:info >nul 2>&1
if errorlevel 1 (
    echo [INFO] Creating new Heroku app...
    heroku create
)

REM Add PostgreSQL if not already added
heroku addons:info heroku-postgresql >nul 2>&1
if errorlevel 1 (
    echo [INFO] Adding PostgreSQL database...
    heroku addons:create heroku-postgresql:mini
)

REM Set environment variables
echo [INFO] Setting environment variables...
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

REM Deploy backend
echo [INFO] Deploying to Heroku...
git add .
git commit -m "Deploy backend to Heroku" 2>nul
git push heroku main

REM Get the backend URL
for /f "tokens=2 delims==" %%i in ('heroku info -s ^| findstr web_url') do set BACKEND_URL=%%i
echo [INFO] Backend deployed to: %BACKEND_URL%

cd ..

REM Frontend deployment
echo [INFO] Deploying Frontend...

cd movie-review-frontend\movie-review-frontend

REM Create production environment file
echo REACT_APP_API_BASE_URL=%BACKEND_URL%/api > .env.production

echo [INFO] Created .env.production with backend URL: %BACKEND_URL%/api

REM Build frontend
echo [INFO] Building frontend...
call npm run build

if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    exit /b 1
) else (
    echo [INFO] Frontend built successfully!
    echo [INFO] You can now deploy the 'build' folder to your preferred platform:
    echo   - Vercel: https://vercel.com
    echo   - Netlify: https://netlify.com
    echo   - Railway: https://railway.app
    echo   - Render: https://render.com
)

cd ..\..

echo [INFO] Deployment script completed!
echo [INFO] Backend URL: %BACKEND_URL%
echo [INFO] Next steps:
echo   1. Deploy the frontend build folder to your preferred platform
echo   2. Update the FRONTEND_URL in Heroku: heroku config:set FRONTEND_URL=YOUR_FRONTEND_URL
echo   3. Test your application

pause 