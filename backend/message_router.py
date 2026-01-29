def classify_message(message: str) -> str:
    msg = message.lower().strip()

    # 1) GREETINGS
    if any(greet in msg for greet in [
        "hi", "hello", "hey", "good morning", "good evening"
    ]):
        return "greeting"

    # 2) FAQ KEYWORDS
    if any(faq in msg for faq in [
        "policy", "rules", "exam", "attendance policy", "grading", "faq"
    ]):
        return "faq"

    # ---------------------------
    # 3) FACULTY-SPECIFIC QUERIES
    # ---------------------------
    faculty_phrases = [
        "department summary",
        "department performance",
        "department report",
        "dept performance",
        "dept summary",
        "department overview",
        "dept overview",
        "my department",
        "students in my department",
        "top students in my department",
        "faculty analytics",
        "teacher analytics",
        "department stats",
    ]

    # Match MULTI-WORD PHRASES FIRST
    if any(phrase in msg for phrase in faculty_phrases):
        return "sql"

    # ---------------------------
    # 4) GENERAL + STUDENT SQL TRIGGERS
    # ---------------------------
    sql_keywords = [
        "gpa", "marks", "score", "result", "performance",
        "highest", "lowest", "top", "best", "worst",
        "attendance", "absences",
        "subject", "subjects",
        "show", "find", "list", "get",
        "department", "dept",
        "students", "faculty", "teacher","faculty performance"
    ]

    if any(word in msg for word in sql_keywords):
        return "sql"

    # ---------------------------
    # 5) DEFAULT → NORMAL CHAT
    # ---------------------------
    return "chat"
