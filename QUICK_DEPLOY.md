# 🎯 Quick Deployment Steps

## 1️⃣ Backend (Render)
```bash
# Push to GitHub
git push origin main

# Go to render.com → New Web Service
# Root: backend
# Build: npm install
# Start: npm start
# Add env variables from .env
```

## 2️⃣ Frontend (Vercel)
```bash
# Update API URL in frontend/src/config.js
# Import in all pages: import API_URL from '../config';
# Replace "http://localhost:5000" with API_URL

# Go to vercel.com → New Project
# Root: frontend
# Framework: Create React App
# Add env: REACT_APP_API_URL=your_render_url
```

## 3️⃣ Update CORS
```javascript
// backend/src/index.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-vercel-url.vercel.app']
}));
```

## ✅ Done!
Test your live app 🎉
