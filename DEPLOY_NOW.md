# 🚀 DEPLOY NOW - Step by Step

## ✅ Pre-Deployment (Done)
- [x] Backend configured for dynamic PORT
- [x] CORS configured for production
- [x] API URLs use environment variables
- [x] All dependencies installed

---

## 📋 Deployment Steps

### Step 1: Push to GitHub (5 min)
```bash
cd /mnt/c/Users/mamid/OneDrive/Desktop/CelebrationHub
git add .
git commit -m "chore: ready for deployment"
git push origin main
```

### Step 2: Deploy Backend on Render (10 min)
1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your **CelebrationHub** repository
4. Configure:
   - **Name**: `celebrationhub-api` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_minimum_32_characters
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
   ⚠️ **Note**: You'll update `FRONTEND_URL` after Step 3

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL**: `https://celebrationhub-api.onrender.com`

---

### Step 3: Deploy Frontend on Vercel (5 min)
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your **CelebrationHub** repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

5. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://celebrationhub-api.onrender.com
   ```
   (Use your actual Render URL from Step 2)

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Copy your frontend URL**: `https://celebrationhub.vercel.app`

---

### Step 4: Update Backend CORS (2 min)
1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://celebrationhub.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will auto-redeploy (takes 2-3 min)

---

## 🎉 You're Live!

**Your app is now deployed at:**
- Frontend: `https://celebrationhub.vercel.app`
- Backend: `https://celebrationhub-api.onrender.com`

---

## 🧪 Test Your Deployment

1. Open your Vercel URL
2. Sign up with a new account
3. Create a celebration
4. Upload an image
5. View all celebrations

---

## ⚠️ Important Notes

### Render Free Tier
- Sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Automatically wakes up on any request

### MongoDB Atlas
- Make sure IP whitelist includes `0.0.0.0/0` (allow all)
- Or add Render's IP addresses

### Cloudinary
- Verify your credentials are correct
- Check upload preset if using unsigned uploads

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly

### Issue: API calls fail
**Solution**: Check `REACT_APP_API_URL` in Vercel environment variables

### Issue: Images not uploading
**Solution**: Verify Cloudinary credentials in Render

### Issue: Database connection error
**Solution**: Check MongoDB Atlas connection string and IP whitelist

### Issue: Backend not responding
**Solution**: Check Render logs for errors (Dashboard → Logs tab)

---

## 📝 After Deployment

1. **Test all features thoroughly**
2. **Monitor logs** in Render and Vercel dashboards
3. **Share your live URL** 🎉

---

## 🔄 Future Updates

To update your deployed app:
```bash
git add .
git commit -m "your update message"
git push origin main
```

Both Render and Vercel will **auto-deploy** on push!

---

**Need help?** Check the logs in Render/Vercel dashboards for error messages.

**Good luck! 🚀**
