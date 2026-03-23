# TaskFlow

Full-stack task manager — FastAPI + React/TypeScript/Vite.

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

> Vite proxies `/auth` and `/tasks` to `localhost:8000` so no CORS issues in dev.

## Stack
- **Backend**: FastAPI, python-jose, passlib, bcrypt
- **Frontend**: React 18, TypeScript, Vite, Axios, CSS Modules
