# Udyam Registration Portal - Deployment Guide

## 🚀 LIVE DEPLOYMENT URLs

- **Frontend**: https://uifron.vercel.app/
- **Backend**: https://udyam-mlhj.onrender.com

## 📁 Deploy Frontend to Vercel

### From Frontend Directory:
1. **Deploy from**: `frontend/` folder
2. **Framework**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://udyam-mlhj.onrender.com
   VITE_API_VERSION=v1
   VITE_APP_ENVIRONMENT=production
   VITE_ENABLE_DEBUG_MODE=false
   VITE_DEFAULT_LANGUAGE=en
   VITE_SUPPORTED_LANGUAGES=en,hi
   ```

## 🚀 Deploy Backend to Render

### From Backend Directory:
1. **Deploy from**: `backend/` folder  
2. **Build Command**: `npm install && npx prisma generate`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   CORS_ORIGIN=https://uifron.vercel.app
   ```

## 🛠️ Local Development

```bash
# Install dependencies
npm run install:all

# Start backend (Terminal 1)
npm run dev:backend

# Start frontend (Terminal 2)  
npm run dev:frontend
```

## ✅ Deployment Checklist

- ✅ Frontend configured for: https://uifron.vercel.app/
- ✅ Backend configured for: https://udyam-mlhj.onrender.com
- ✅ CORS origin set to frontend URL
- ✅ API base URL points to backend URL
- ✅ Security headers configured
- ✅ Content Security Policy updated
