# Udyam Registration Portal - Deployment Guide

## 🚀 Quick Deploy to Render

### Option 1: Deploy Frontend Only (Recommended for Quick Start)

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Branch: `master`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

2. **Environment Variables for Frontend:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_API_VERSION=v1
   VITE_APP_ENVIRONMENT=production
   VITE_ENABLE_DEBUG_MODE=false
   VITE_DEFAULT_LANGUAGE=en
   VITE_SUPPORTED_LANGUAGES=en,hi
   ```

### Option 2: Deploy Backend Separately

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Branch: `master`
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

2. **Environment Variables for Backend:**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### Option 3: Deploy to Vercel (Frontend) + Railway (Backend)

#### Vercel (Frontend):
1. Connect GitHub repository to Vercel
2. Framework: Vite
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`

#### Railway (Backend):
1. Connect GitHub repository to Railway
2. Root Directory: `backend`
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Update with your local database URL

3. **Run development servers:**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend  
   npm run dev:frontend
   ```

## 📝 Notes

- The project uses npm by default
- Make sure to update CORS_ORIGIN and VITE_API_BASE_URL with your actual deployment URLs
- Database migrations will run automatically on Railway/Render
- Frontend is optimized for static hosting
