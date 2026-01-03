def classify_message(message: str) -> str:
    msg = message.lower().strip()

    # 1️⃣ Greeting / small talk
    if any(greet in msg for greet in [
        "hi", "hello", "hey", "good morning", "good evening"
    ]):
        return "greeting"

    # 2️⃣ FAQ / policy / rules (RAG)
    if any(faq in msg for faq in [
        "policy", "rule", "rules", "attendance policy",
        "exam policy", "grading system", "faq"
    ]):
        return "faq"

    # 3️⃣ SQL — STUDENT / ACADEMIC / ANALYTICS (🔥 IMPORTANT)
    if any(keyword in msg for keyword in [
        # student related
        "student", "students", "my", "me",

        # performance
        "gpa", "cgpa", "grade", "grades", "marks",
        "performance", "result", "score",

        # subject / academics
        "subject", "subjects", "subjectwise", "subject wise",
        "attendance", "absent", "absences",

        # faculty / admin analytics
        "faculty", "teacher", "professor",
        "rating", "evaluation", "score",

        # analytics
        "average", "count", "total", "highest", "lowest",
        "list", "show", "find", "get"
    ]):
        return "sql"

    # 4️⃣ Default fallback
    return "chat"
