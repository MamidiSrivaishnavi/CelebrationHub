#!/bin/bash

echo "🚀 CelebrationHub - Preparing for Deployment"
echo "=============================================="
echo ""

# Add all changes
echo "📦 Adding all changes to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "chore: ready for production deployment - configured PORT, CORS, and API URLs"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "=============================================="
echo "🎯 NEXT STEPS:"
echo "=============================================="
echo ""
echo "1. Deploy Backend on Render:"
echo "   → Go to: https://render.com"
echo "   → New Web Service → Connect GitHub"
echo "   → Root: backend"
echo "   → Add environment variables from backend/.env"
echo ""
echo "2. Deploy Frontend on Vercel:"
echo "   → Go to: https://vercel.com"
echo "   → New Project → Import GitHub"
echo "   → Root: frontend"
echo "   → Add: REACT_APP_API_URL=<your-render-url>"
echo ""
echo "3. Update CORS:"
echo "   → Add FRONTEND_URL=<your-vercel-url> in Render"
echo ""
echo "📖 Full guide: See DEPLOY_NOW.md"
echo ""
echo "Good luck! 🎉"
