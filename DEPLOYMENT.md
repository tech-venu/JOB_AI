# 🚀 VJOBAI Deployment Guide — Free Cloud Hosting

This guide deploys the full **VJOBAI** project publicly so anyone in the world can access it.

## Architecture

```
User Browser
    │
    ▼
Vercel (Frontend — React)          ← https://job-ai-vjobai.vercel.app
    │  /api/* → proxy →
    ▼
Render (Backend — Node.js/Express) ← https://job-ai-backend.onrender.com
    │
    ▼
MongoDB Atlas (Cloud Database)     ← Free 512MB cluster
```

---

## Step 1 — Set Up MongoDB Atlas (Free Cloud Database)

1. Go to **https://cloud.mongodb.com** → Sign up / Log in with Google
2. Click **"Build a Database"** → Choose **Free** (M0 Sandbox)
3. Select provider: **AWS**, Region: **Mumbai (ap-south-1)**
4. Click **Create** → Set username: `vjobai` and a password → Click **Create User**
5. Under **"Where would you like to connect from?"** → Select **"Allow access from anywhere"** → Add `0.0.0.0/0`
6. Click **Connect** → **Connect your application** → Copy the URI:
   ```
   mongodb+srv://vjobai:<password>@cluster0.xxxxx.mongodb.net/hirematch_ai?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password. **Save this URI.**

---

## Step 2 — Deploy Backend to Render (Free)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **New +** → **Web Service**
3. Connect your repo: `tech-venu/JOB_AI`
4. Settings:
   - **Name**: `job-ai-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | (paste your Atlas URI from Step 1) |
   | `JWT_SECRET` | (any random 32-char string, e.g. `vjobai_super_secret_key_2026_venu`) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `https://job-ai-vjobai.vercel.app` |
6. Click **Create Web Service** → Wait 3-5 minutes for build
7. Your backend URL will be: `https://job-ai-backend.onrender.com`

---

## Step 3 — Deploy Frontend to Vercel (Free)

1. Go to **https://vercel.com** → Sign up / Log in with GitHub
2. Click **"Add New Project"** → Import `tech-venu/JOB_AI`
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://job-ai-backend.onrender.com/api` |
5. Click **Deploy** → Wait 2-3 minutes
6. Your frontend URL will be: `https://job-ai-vjobai.vercel.app`

---

## Step 4 — Seed the Database

After backend is live, seed demo data by visiting:
```
https://job-ai-backend.onrender.com/api/health
```
Then run seed script locally (pointing to Atlas):
```bash
MONGODB_URI="mongodb+srv://vjobai:..." cd backend && node utils/seed.js
```

---

## Final URLs

| Service | URL |
|---|---|
| 🌐 **Live App** | https://job-ai-vjobai.vercel.app |
| 🔑 **Login** | https://job-ai-vjobai.vercel.app/login |
| 📝 **Register** | https://job-ai-vjobai.vercel.app/register |
| ⚙️ **API Health** | https://job-ai-backend.onrender.com/api/health |
| 💾 **GitHub Code** | https://github.com/tech-venu/JOB_AI |
