# Render Deployment Configuration

# This file forces Render to use npm instead of yarn
# Place this in the root of your repository

# Frontend Build Settings:
# Build Command: npm install && npm run build
# Publish Directory: frontend/dist

# Backend Build Settings: 
# Build Command: npm install && npx prisma generate
# Start Command: npm start

# Environment Variables needed:
# NODE_ENV=production
# DATABASE_URL=your_postgres_connection_string
# CORS_ORIGIN=https://your-frontend-domain.onrender.com
