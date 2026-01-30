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


# --------------------------------------------------------
# SQL CLEANUP
# --------------------------------------------------------
def cleanup_sql(sql: str) -> str:
    sql = (
        sql.replace("```sql", "")
           .replace("```", "")
           .replace("\n", " ")
           .replace("\r", " ")
           .replace("\t", " ")
    )
    return " ".join(sql.split())


# --------------------------------------------------------
# FASTAPI APP
# --------------------------------------------------------
app = FastAPI(title="SmartCampus AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Allow all (Vercel)
    allow_credentials=False, # MUST be false with "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "SmartCampus backend running"}

@app.get("/health")
def health():
    return {"ok": True}


# --------------------------------------------------------
# MODELS
# --------------------------------------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class AskRequest(BaseModel):
    session_id: str
    role: str
    user_id: str | None
    department: str | None
    message: str


# --------------------------------------------------------
# LOGIN
# --------------------------------------------------------
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


# --------------------------------------------------------
# LOAD FAQS ON STARTUP
# --------------------------------------------------------
@app.on_event("startup")
def load_faqs():
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT question, answer FROM faqs")).fetchall()
    add_faqs([(q, a) for q, a in rows])
    print("FAQs loaded")


# --------------------------------------------------------
# ASK ENDPOINT
# --------------------------------------------------------
@app.post("/ask")
def ask(req: AskRequest):

    init_session(req.session_id)
    add_message(req.session_id, "user", req.message)

    route = classify_message(req.message)

    # Chat
    if route in ["greeting", "chat"]:
        response = call_llm(f"You are a helpful SmartCampus assistant.\nUser: {req.message}")

    # FAQ
    elif route == "faq":
        ctx = retrieve_faq_context(req.message)
        prompt = f"Use ONLY this context:\n\n{ctx}\n\nQ: {req.message}"
        response = call_llm(prompt)

    # SQL Mode
    elif route == "sql":
        schema = load_schema()

        if req.role == "student":
            prompt = build_student_prompt(req.message, schema, req.user_id)
        elif req.role == "faculty":
            prompt = build_faculty_prompt(req.message, schema, req.department)
        else:
            prompt = build_admin_prompt(req.message, schema)

        sql = call_llm(prompt).strip()
        sql = cleanup_sql(sql)

        if not is_safe_sql(sql):
            response = "Unsafe SQL blocked."
        else:
            sql = apply_rbac(sql, req.role, req.user_id)
            rows, cols = execute_sql(sql)
            response = {
                "sql": sql,
                "data": [dict(zip(cols, r)) for r in rows]
            }

    else:
        response = "I don’t know how to respond."

    add_message(req.session_id, "assistant", str(response))

    return {
        "route": route,
        "response": response,
        "history": get_history(req.session_id)
    }


# --------------------------------------------------------
# STUDENT ROUTES
# --------------------------------------------------------
@app.get("/student/{student_id}/gpa")
def student_gpa(student_id: str):
    rows, _ = execute_sql(
        f"SELECT ROUND(AVG(gpa),2) FROM student_performance WHERE student_id='{student_id}'"
    )
    return {"overall_gpa": rows[0][0]}


@app.get("/student/{student_id}/subjects")
def student_subjects(student_id: str):
    rows, _ = execute_sql(
        f"SELECT DISTINCT subject_name FROM student_performance WHERE student_id='{student_id}'"
    )
    return {"subjects": [r[0] for r in rows]}


# --------------------------------------------------------
# FACULTY ROUTES
# --------------------------------------------------------
@app.get("/faculty/{dept}/summary")
def faculty_summary(dept: str):
    with engine.connect() as conn:
        total = conn.execute(text("SELECT COUNT(*) FROM students WHERE department=:d"), {"d": dept}).scalar()
        avg = conn.execute(text("""
            SELECT AVG(gpa) 
            FROM student_performance sp 
            JOIN students s ON s.student_id = sp.student_id 
            WHERE s.department=:d
        """), {"d": dept}).scalar()

    return {"department": dept, "total_students": total, "avg_gpa": round(avg or 0, 2)}


@app.get("/faculty/{dept}/top-students")
def faculty_top(dept: str):
    rows = engine.execute(text("""
        SELECT s.student_name, sp.gpa, sp.final_marks, sp.absences
        FROM students s 
        JOIN student_performance sp 
           ON s.student_id = sp.student_id 
        WHERE s.department=:d
        ORDER BY sp.gpa DESC 
        LIMIT 5
    """), {"d": dept}).fetchall()

    return {"students": [
        {"name": r[0], "gpa": r[1], "marks": r[2], "absences": r[3]}
        for r in rows
    ]}


# --------------------------------------------------------
# ADMIN ROUTES
# --------------------------------------------------------
@app.get("/admin/stats")
def admin_stats():
    with engine.connect() as conn:
        s_count = conn.execute(text("SELECT COUNT(*) FROM students")).scalar()
        f_count = conn.execute(text("SELECT COUNT(*) FROM faculty_details")).scalar()
    return {"students": s_count, "faculty": f_count}


@app.get("/admin/top-students")
def admin_top_students():
    rows, _ = execute_sql("""
        SELECT s.student_name, s.department, ROUND(AVG(sp.gpa),2)
        FROM students s
        JOIN student_performance sp ON s.student_id = sp.student_id
        GROUP BY s.student_name, s.department
        ORDER BY 3 DESC
        LIMIT 5
    """)
    return {"students": [
        {"name": r[0], "department": r[1], "gpa": r[2]}
        for r in rows
    ]}


@app.get("/admin/top-faculty")
def admin_top_faculty():
    rows, _ = execute_sql("""
        SELECT lecturer_id, department, designation, overall_performance_score
        FROM faculty_details
        ORDER BY overall_performance_score DESC
        LIMIT 5
    """)
    return {"faculty": [
        {"lecturer_id": r[0], "department": r[1], "designation": r[2], "score": r[3]}
        for r in rows
    ]}
