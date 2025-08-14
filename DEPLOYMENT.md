# Udyam Registration Portal - Deployment Guide

## 🚀 Quick Deploy to Render

### Frontend Deployment:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Environment Variables**:
  ```
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
  VITE_API_VERSION=v1
  VITE_APP_ENVIRONMENT=production
  VITE_ENABLE_DEBUG_MODE=false
  VITE_DEFAULT_LANGUAGE=en
  VITE_SUPPORTED_LANGUAGES=en,hi
  ```

### Backend Deployment:
- **Build Command**: `cd backend && npm install && npx prisma generate`
- **Start Command**: `cd backend && npm start`
- **Environment Variables**:
  ```
  NODE_ENV=production
  PORT=5000
  DATABASE_URL=postgresql://username:password@hostname:port/database_name
  CORS_ORIGIN=https://your-frontend-url.onrender.com
  ```

## 🚀 Deploy to Vercel (Frontend)

1. **Connect GitHub repository to Vercel**
2. **Framework Preset**: Vite  
3. **Root Directory**: `frontend`
4. **Environment Variables**: (same as above)

## 🚀 Deploy to Railway (Backend)

1. **Connect GitHub repository to Railway**
2. **Root Directory**: `backend`
3. **Environment Variables**: (same as above)

## 🛠️ Local Development

```bash
# Install dependencies
npm run install:all

# Start backend (Terminal 1)
npm run dev:backend

# Start frontend (Terminal 2)  
npm run dev:frontend
```

## 📝 Notes

- Use `npm` for local development
- Both `npm` and `yarn` are supported for deployment
- Make sure to update CORS_ORIGIN and VITE_API_BASE_URL with actual URLs
