from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

# Internal Modules
from db import engine
from conversation_memory import init_session, get_history, add_message
from message_router import classify_message
from schema_loader import load_schema
from prompt_student import build_student_prompt
from prompt_faculty import build_faculty_prompt
from prompt_admin import build_admin_prompt
from llm_adapter import call_llm
from sql_guard import is_safe_sql
from query_executor import execute_sql
from rag_retriever import retrieve_faq_context
from rag_store import add_faqs
from access_control import apply_rbac
from auth_service import authenticate_user

# -----------------------------------------------------
# FASTAPI + CORS
# -----------------------------------------------------
app = FastAPI(title="SmartCampus AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # allow Vercel frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "SmartCampus backend running"}

@app.get("/health")
def health():
    return {"ok": True}

# -----------------------------------------------------
# MODELS
# -----------------------------------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class AskRequest(BaseModel):
    session_id: str
    role: str
    user_id: str | None
    department: str | None
    message: str

# -----------------------------------------------------
# LOGIN
# -----------------------------------------------------
@app.post("/login")
def login(req: LoginRequest):
    user = authenticate_user(req.username, req.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["role"] == "student":
        return {
            "message": "Login successful",
            "role": user["role"],
            "user_id": user["linked_student_id"],
            "department": user["department"],
            "display_id": user["linked_student_id"],
            "username": user["username"]
        }

    return {
        "message": "Login successful",
        "role": user["role"],
        "user_id": None,
        "department": user["department"],
        "display_id": user["username"],
        "username": user["username"]
    }

# -----------------------------------------------------
# LOAD FAQS
# -----------------------------------------------------
@app.on_event("startup")
def load_faqs():
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT question, answer FROM faqs")).fetchall()

    add_faqs([(q, a) for q, a in rows])
    print("FAQs loaded")

# -----------------------------------------------------
# ASK ENDPOINT
# -----------------------------------------------------
@app.post("/ask")
def ask(req: AskRequest):
    session_id = req.session_id
    role = req.role
    message = req.message

    init_session(session_id)
    add_message(session_id, "user", message)

    route = classify_message(message)

    if route in ["greeting", "chat"]:
        response = call_llm(f"You are a helpful SmartCampus assistant.\nUser: {message}")

    elif route == "faq":
        ctx = retrieve_faq_context(message)
        prompt = f"Use ONLY this context:\n\n{ctx}\n\nQ: {message}"
        response = call_llm(prompt)

    elif route == "sql":
        schema = load_schema()

        if role == "student":
            prompt = build_student_prompt(message, schema, req.user_id)
        elif role == "faculty":
            prompt = build_faculty_prompt(message, schema, req.department)
        else:
            prompt = build_admin_prompt(message, schema)

        sql = call_llm(prompt).strip()
        sql = sql.replace("```sql", "").replace("```", "")
        sql = " ".join(sql.split())

        if not is_safe_sql(sql):
            response = "Unsafe SQL blocked."
        else:
            sql = apply_rbac(sql, role, req.user_id)
            rows, cols = execute_sql(sql)
            response = {
                "sql": sql,
                "data": [dict(zip(cols, r)) for r in rows]
            }
    else:
        response = "I don't know how to respond."

    add_message(session_id, "assistant", str(response))
    return {
        "route": route,
        "response": response,
        "history": get_history(session_id)
    }
