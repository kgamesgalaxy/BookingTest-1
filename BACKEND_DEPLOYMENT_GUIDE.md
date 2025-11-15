# 🚀 Backend Deployment Guide - E1 Platform

## ❌ **Current Issue**
Your backend is **NOT deployed** on E1 platform. The URL in `_redirects` points to a non-existent backend:
```
https://e239b078-6e78-47a7-b7f1-cef6da6b3bb4.e1-us-east-1.amy.app
```

Error: `No such host is known` ❌

## ✅ **Solution: Deploy Backend to E1 Platform**

### **Step 1: Prepare Backend for Deployment**

I've created the necessary files:
- ✅ `backend/Dockerfile` - Docker configuration
- ✅ `backend/.dockerignore` - Exclude unnecessary files

### **Step 2: Deploy to E1 Platform**

#### **Option A: Using E1 CLI (Recommended)**

1. **Install E1 CLI:**
   ```bash
   npm install -g @e1/cli
   # or
   yarn global add @e1/cli
   ```

2. **Login to E1:**
   ```bash
   e1 login
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   e1 deploy
   ```

4. **Get the Backend URL:**
   After deployment, E1 will give you a URL like:
   ```
   https://your-app-id.e1-us-east-1.amy.app
   ```

5. **Update `_redirects` file:**
   Replace the URL in `frontend/public/_redirects` with your new backend URL.

#### **Option B: Using E1 Web Dashboard**

1. Go to https://e1.amy.app
2. Login with your account
3. Click "New Project"
4. Connect your GitHub repository
5. Select the `backend` folder
6. E1 will auto-detect the Dockerfile
7. Click "Deploy"
8. Copy the deployment URL
9. Update `frontend/public/_redirects` with the new URL

### **Step 3: Configure Environment Variables on E1**

After deployment, add these environment variables in E1 dashboard:

```env
MONGO_URL=your_mongodb_connection_string
FRONTEND_URL=https://your-netlify-site.netlify.app
```

### **Step 4: Update Frontend Configuration**

Update `frontend/public/_redirects`:
```
/api/*  https://YOUR-NEW-E1-URL.e1-us-east-1.amy.app/api/:splat  200!
/*      /index.html   200
```

### **Step 5: Redeploy Frontend**

```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

---

## 🔄 **Alternative: Use a Different Backend Hosting**

If E1 platform is not working, you can deploy to other platforms:

### **Option 1: Railway.app (Easiest)**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Select `backend` folder
5. Railway auto-detects Python and deploys
6. Get the URL: `https://your-app.railway.app`
7. Update `_redirects` with this URL

### **Option 2: Render.com (Free Tier)**

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy
7. Get URL and update `_redirects`

### **Option 3: Fly.io**

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login: `fly auth login`
3. Deploy:
   ```bash
   cd backend
   fly launch
   fly deploy
   ```
4. Get URL: `https://your-app.fly.dev`
5. Update `_redirects`

### **Option 4: Heroku**

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app:
   ```bash
   cd backend
   heroku create your-app-name
   git push heroku main
   ```
4. Get URL: `https://your-app-name.herokuapp.com`
5. Update `_redirects`

---

## 🧪 **Testing Backend After Deployment**

### **1. Test Health Endpoint:**
```bash
curl https://YOUR-BACKEND-URL/api/
```

Expected response:
```json
{"message": "Karthikeya Games Galaxy API is running!"}
```

### **2. Test Availability Endpoint:**
```bash
curl https://YOUR-BACKEND-URL/api/availability/2025-01-30
```

Expected response:
```json
{
  "date": "2025-01-30",
  "time_slots": [
    {"time": "10:00 AM", "available": true, "booked": 0, "capacity": 1},
    ...
  ]
}
```

### **3. Test from Browser:**
Open browser console and run:
```javascript
fetch('https://YOUR-BACKEND-URL/api/')
  .then(r => r.json())
  .then(console.log)
```

---

## 📝 **Quick Fix: Use Existing Backend (If You Have One)**

If you already have a backend deployed somewhere:

1. **Find your backend URL**
2. **Update `frontend/public/_redirects`:**
   ```
   /api/*  https://YOUR-ACTUAL-BACKEND-URL/api/:splat  200!
   /*      /index.html   200
   ```
3. **Commit and push:**
   ```bash
   git add frontend/public/_redirects
   git commit -m "Fix: Update backend URL"
   git push origin main
   ```

---

## 🆘 **Still Not Working?**

### **Temporary Solution: Use Mock Data**

While you set up the backend, I can create a mock API service that returns dummy data so you can test the frontend:

1. Create `frontend/src/services/mockApi.js` with dummy data
2. Switch to mock mode in development
3. Deploy backend separately
4. Switch back to real API

Would you like me to create the mock API service?

---

## ✅ **Checklist**

- [ ] Backend deployed to hosting platform
- [ ] Backend URL obtained
- [ ] Environment variables configured (MONGO_URL, FRONTEND_URL)
- [ ] `_redirects` file updated with correct backend URL
- [ ] Frontend redeployed to Netlify
- [ ] Backend health endpoint tested
- [ ] Availability endpoint tested
- [ ] Time slots loading in frontend

---

## 🎯 **Recommended Next Steps**

1. **Deploy backend to Railway.app** (easiest option)
2. **Get the backend URL**
3. **Update `_redirects` file**
4. **Push to GitHub**
5. **Test on Netlify**

Let me know which hosting platform you want to use, and I'll help you deploy!
