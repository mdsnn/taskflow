# TaskFlow — Full Stack Task Manager

A production-ready task management application built with **React + TypeScript** (frontend) and **FastAPI** (backend), featuring JWT authentication and full CRUD functionality.

![TaskFlow Screenshot](screenshot.png)

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, CSS Modules  |
| Backend   | FastAPI, Python 3.11+                    |
| Auth      | JWT (python-jose + passlib bcrypt)       |
| Database  | In-memory (swap to PostgreSQL for prod)  |

## Features

- JWT authentication — register and login
- Create, edit, and delete tasks
- Mark tasks complete / active with one click
- Filter by status: all / active / completed
- Priority levels: high / medium / low
- Live stats: total, active, done, completion rate
- Progress bar tracking overall completion
- Real-time search across task titles and descriptions
- Axios interceptor handles 401s and redirects automatically

## Project Structure

```
taskflow/
├── backend/
│   ├── main.py           # FastAPI app — routes, auth, task logic
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/          # axios client + auth/tasks API calls
    │   ├── components/   # Sidebar, TaskCard, TaskModal, StatsRow
    │   ├── hooks/        # useAuth, useTasks
    │   ├── pages/        # AuthPage, DashboardPage
    │   └── types/        # TypeScript interfaces
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:8000`, so no CORS issues in development.

## API Reference

| Method | Endpoint             | Auth | Description          |
|--------|----------------------|------|----------------------|
| POST   | `/auth/register`     | No   | Create account       |
| POST   | `/auth/login`        | No   | Get JWT token        |
| GET    | `/auth/me`           | Yes  | Current user info    |
| GET    | `/tasks`             | Yes  | List tasks (filterable by `?filter=active\|completed`) |
| POST   | `/tasks`             | Yes  | Create task          |
| PATCH  | `/tasks/{id}`        | Yes  | Update task          |
| DELETE | `/tasks/{id}`        | Yes  | Delete task          |
| GET    | `/tasks/stats`       | Yes  | Task statistics      |

## Moving to Production

Replace the in-memory dicts in `main.py` with SQLAlchemy + PostgreSQL:

```bash
pip install sqlalchemy psycopg2-binary alembic python-dotenv
```

```python
# .env
DATABASE_URL=postgresql://user:password@localhost/taskflow
SECRET_KEY=your-secure-random-secret
```