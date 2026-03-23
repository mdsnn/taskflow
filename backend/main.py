from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = "change-this-in-production-use-env-var"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

app = FastAPI(title="TaskFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth helpers ──────────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ── In-memory "database" (swap with SQLAlchemy + PostgreSQL for production) ───
users_db: dict = {}
tasks_db: dict = {}  # user_id -> list of tasks

# ── Schemas ───────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "medium"  # low | medium | high

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None

class Task(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    completed: bool
    created_at: str

# ── Auth logic ────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

# ── Auth routes ───────────────────────────────────────────────────────────────
@app.post("/auth/register", response_model=Token)
def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already taken")
    users_db[user.username] = hash_password(user.password)
    tasks_db[user.username] = []
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "username": user.username}

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    hashed = users_db.get(form_data.username)
    if not hashed or not verify_password(form_data.password, hashed):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token({"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer", "username": form_data.username}

@app.get("/auth/me")
def me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

# ── Task routes ───────────────────────────────────────────────────────────────
@app.get("/tasks", response_model=List[Task])
def get_tasks(
    filter: Optional[str] = None,  # all | active | completed
    current_user: str = Depends(get_current_user)
):
    tasks = tasks_db.get(current_user, [])
    if filter == "active":
        tasks = [t for t in tasks if not t["completed"]]
    elif filter == "completed":
        tasks = [t for t in tasks if t["completed"]]
    return tasks

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate, current_user: str = Depends(get_current_user)):
    new_task = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description or "",
        "priority": task.priority or "medium",
        "completed": False,
        "created_at": datetime.utcnow().isoformat(),
    }
    tasks_db.setdefault(current_user, []).append(new_task)
    return new_task

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(
    task_id: str,
    updates: TaskUpdate,
    current_user: str = Depends(get_current_user)
):
    tasks = tasks_db.get(current_user, [])
    for task in tasks:
        if task["id"] == task_id:
            if updates.title is not None:
                task["title"] = updates.title
            if updates.description is not None:
                task["description"] = updates.description
            if updates.priority is not None:
                task["priority"] = updates.priority
            if updates.completed is not None:
                task["completed"] = updates.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, current_user: str = Depends(get_current_user)):
    tasks = tasks_db.get(current_user, [])
    original_len = len(tasks)
    tasks_db[current_user] = [t for t in tasks if t["id"] != task_id]
    if len(tasks_db[current_user]) == original_len:
        raise HTTPException(status_code=404, detail="Task not found")

@app.get("/tasks/stats")
def get_stats(current_user: str = Depends(get_current_user)):
    tasks = tasks_db.get(current_user, [])
    total = len(tasks)
    completed = sum(1 for t in tasks if t["completed"])
    by_priority = {"high": 0, "medium": 0, "low": 0}
    for t in tasks:
        by_priority[t.get("priority", "medium")] += 1
    return {
        "total": total,
        "completed": completed,
        "active": total - completed,
        "completion_rate": round((completed / total * 100) if total else 0, 1),
        "by_priority": by_priority,
    }

@app.get("/")
def root():
    return {"message": "TaskFlow API is running", "docs": "/docs"}