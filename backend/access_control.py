def apply_rbac(sql: str, role: str, user_id: str | None):
    sql = sql.strip().rstrip(";")
    lower = sql.lower()

    # 1. Block forbidden tables for ALL roles
    if "users_auth" in lower or "linked_student_id" in lower:
        raise ValueError("Unauthorized access")

    # 2. STUDENT → must restrict to own data
    if role == "student" and user_id:

        # If LLM already correctly used alias s.student_id
        if f"s.student_id = '{user_id.lower()}'" in lower or f"s.student_id = '{user_id}'" in lower:
            return sql   # do NOT modify

        # If WHERE exists but alias unknown → add alias-safe filter
        if "where" in lower:
            return sql + f" AND s.student_id = '{user_id}'"

        # If no WHERE → create one safely
        return sql + f" WHERE s.student_id = '{user_id}'"

    # 3. FACULTY → NO extra enforcement in RBAC
    if role == "faculty":
        return sql

    # 4. ADMIN → full access
    if role == "admin":
        return sql

    return sql
