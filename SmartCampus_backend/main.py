from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware   # 👈 ADD THIS
from pydantic import BaseModel
from sqlalchemy import text

from db import engine
from conversation_memory import init_session, get_history, add_message
from message_router import classify_message
from schema_loader import load_schema
from prompt_builder import build_prompt
from llm_adapter import call_llm
from sql_guard import is_safe_sql
from query_executor import execute_sql
from rag_retriever import retrieve_faq_context
from rag_store import add_faqs
from access_control import apply_rbac
from auth_service import authenticate_user

app = FastAPI(title="SmartCampus AI Assistant")

# ===================== CORS (IMPORTANT) =====================
# This allows React (Vite) frontend to call backend APIs

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ===========================================================


# ===================== MODELS =====================

class LoginRequest(BaseModel):
    username: str
    password: str


class AskRequest(BaseModel):
    session_id: str
    role: str                # student / faculty / admin
    user_id: str | None      # student_id for students, None otherwise
    message: str

#--backend running status--#

@app.get("/")
def root():
    return {"status": "SmartCampus backend running"}

# ===================== LOGIN =====================

@app.post("/login")
def login(req: LoginRequest):
    user = authenticate_user(req.username, req.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "role": user["role"],
        "user_id": user["linked_student_id"]
    }


# ===================== LOAD FAQS (RAG) =====================

@app.on_event("startup")
def load_faq_data():
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT question, answer FROM faqs")
        ).fetchall()

    faq_rows = [(r[0], r[1]) for r in rows]
    add_faqs(faq_rows)
    print("✅ FAQs loaded into RAG store")


# ===================== MAIN ASSISTANT =====================

@app.post("/ask")
def ask(req: AskRequest):

    session_id = req.session_id
    message = req.message
    role = req.role
    user_id = req.user_id

    # Initialize conversation
    init_session(session_id)
    add_message(session_id, "user", message)

    route = classify_message(message)

    # -------- 1. GREETING / CHAT --------
    if route in ["greeting", "chat"]:
        response = call_llm(
            f"You are a friendly university assistant.\nUser: {message}"
        )

    # -------- 2. FAQ (RAG) --------
    elif route == "faq":
        try:
            context = retrieve_faq_context(message)
            prompt = f"""
You are SmartCampus assistant.
Answer ONLY using the context below.

CONTEXT:
{context}   

QUESTION:
{message}
"""
            response = call_llm(prompt)

        except Exception as e:
            response = f"FAQ ERROR: {str(e)}"

    # -------- 3. SQL QUERY (RBAC ENFORCED) --------
    elif route == "sql":
        try:
            schema = load_schema()
            prompt = build_prompt(message, schema)

            sql = call_llm(prompt).strip()
            print("🧠 LLM GENERATED SQL:\n", sql)

            if not is_safe_sql(sql):
                response = "Query blocked for security reasons."
            else:
                # 🔐 RBAC enforced here (NOT in prompt)
                sql = apply_rbac(sql, role, user_id)

                rows, cols = execute_sql(sql)

                json_rows = [
                    dict(zip(cols, row))
                    for row in rows
                ]

                response = {
                    "sql": sql,
                    "data": json_rows
                }

        except Exception as e:
            response = f"SQL ERROR: {str(e)}"

    # -------- 4. FALLBACK --------
    else:
        response = "I'm not sure how to help with that."

    add_message(session_id, "assistant", str(response))

    return {
        "route": route,
        "response": response,
        "history": get_history(session_id)
    }
