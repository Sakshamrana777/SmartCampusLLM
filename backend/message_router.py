import re


def _contains_word(msg: str, phrases: list[str]) -> bool:
    """
    Word-boundary match instead of plain substring match.
    Plain `"hi" in msg` was matching inside unrelated words like
    "history" or "this", misrouting real questions as greetings.
    """
    return any(re.search(rf"\b{re.escape(p)}\b", msg) for p in phrases)


def classify_message(message: str) -> str:
    msg = message.lower().strip()

    # 1) GREETINGS
    greetings = ["hi", "hello", "hey", "good morning", "good evening"]
    if _contains_word(msg, greetings):
        return "greeting"

    # 2) FAQ KEYWORDS
    faq_words = ["policy", "rules", "exam", "attendance policy", "grading", "faq"]
    if _contains_word(msg, faq_words):
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

    # These are multi-word phrases already, so plain substring matching
    # is safe here (low false-positive risk vs single short words above).
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
        "students", "faculty", "teacher", "faculty performance",
    ]

    if _contains_word(msg, sql_keywords):
        return "sql"

    # ---------------------------
    # 5) DEFAULT → NORMAL CHAT
    # ---------------------------
    return "chat"