@echo off
echo.
echo ========================================
echo   CelebrationHub - Deployment Prep
echo ========================================
echo.

echo [1/3] Adding all changes to git...
git add .

echo [2/3] Committing changes...
git commit -m "chore: ready for production deployment"

echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Deploy Backend on Render
echo    - Go to: https://render.com
echo    - Root: backend
echo    - Add env variables from backend/.env
echo.
echo 2. Deploy Frontend on Vercel
echo    - Go to: https://vercel.com
echo    - Root: frontend
echo    - Add: REACT_APP_API_URL=your-render-url
echo.
echo 3. Update CORS in Render
echo    - Add: FRONTEND_URL=your-vercel-url
echo.
echo Full guide: DEPLOY_NOW.md
echo.
pause
