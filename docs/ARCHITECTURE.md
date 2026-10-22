# KIẾN TRÚC VÀ HẠ TẦNG DEPLOY - TUẦN 1

## 1. Sơ đồ kết nối (System Architecture)

[ Client / Browser ] 
       │
       ├──► Frontend (React / Vite) ──► Host trên VERCEL (Public URL)
       │         │
       │         └── API Requests (HTTPS)
       │                   │
       └──────────────────►┼──► Backend (Node.js Express) ──► Host trên RENDER (Public URL)
                           │         │
                           │         └── Database Connection (PostgreSQL)
                           │                   │
                           └──────────────────►└──► Database Cloud (SUPABASE / NEON.TECH)

## 2. Cấu hình Biến Môi Trường (Environment Variables)

### Frontend (.env)
VITE_API_BASE_URL=https://<your-backend-on-render>.onrender.com/api

### Backend (.env)
PORT=5000
DATABASE_URL=postgresql://user:password@ep-cool-db.supabase.co:5432/postgres
CLIENT_URL=https://<your-frontend-on-vercel>.vercel.app
JWT_SECRET=week1_mvp_secret_key