# 🚀 CelebrationHub Deployment Guide

## Overview
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free)
- **Database**: MongoDB Atlas (Free)

---

## Part 1: Deploy Backend to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `celebrationhub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
In Render dashboard, go to **Environment** tab and add:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Copy your backend URL (e.g., `https://celebrationhub-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL in Frontend
1. Open `frontend/.env.production`
2. Replace with your Render backend URL:
   ```
   REACT_APP_API_URL=https://celebrationhub-backend.onrender.com
   ```

### Step 2: Update All API Calls
Replace all `http://localhost:5000` with `process.env.REACT_APP_API_URL || 'http://localhost:5000'`

**Files to update:**
- `frontend/src/pages/Login.js`
- `frontend/src/pages/Signup.js`
- `frontend/src/pages/Dashboard.js`
- `frontend/src/pages/AllCelebrations.js`
- `frontend/src/pages/CelebrationView.js`
- `frontend/src/pages/CreateCelebration.js`
- `frontend/src/pages/EditCelebration.js`
- `frontend/src/pages/AdminDashboard.js`

### Step 3: Commit Changes
```bash
git add .
git commit -m "chore: update API URLs for production"
git push origin main
```

### Step 4: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 5: Add Environment Variable
In Vercel project settings → **Environment Variables**:
```
REACT_APP_API_URL=https://celebrationhub-backend.onrender.com
```

### Step 6: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your app will be live at `https://your-project.vercel.app`

---

## Part 3: Update Backend CORS

### Update `backend/src/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Commit and push - Render will auto-deploy.

---

## Part 4: MongoDB Atlas Setup (if not done)

1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Add to Render environment variables

---

## ✅ Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS updated with Vercel URL
- [ ] All API URLs updated
- [ ] Test login/signup
- [ ] Test create celebration
- [ ] Test image upload

---

## 🐛 Common Issues

### Issue 1: CORS Error
**Solution**: Add Vercel URL to backend CORS configuration

### Issue 2: API calls failing
**Solution**: Check environment variables in Vercel

### Issue 3: Images not loading
**Solution**: Verify Cloudinary credentials in Render

### Issue 4: Render app sleeping
**Solution**: Free tier sleeps after 15 min inactivity (first request takes 30s)

---

## 📝 Post-Deployment

1. Test all features
2. Share your live URL! 🎉
3. Monitor logs in Render/Vercel dashboards

---

**Your app will be live at:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://celebrationhub-backend.onrender.com`
