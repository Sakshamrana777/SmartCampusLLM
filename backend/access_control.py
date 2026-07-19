def apply_rbac(sql: str, role: str, user_id: str | None, department: str | None = None):
    sql = sql.strip().rstrip(";")
    lower = sql.lower()

    # 1. Block forbidden tables for ALL roles
    if "users_auth" in lower or "linked_student_id" in lower:
        raise ValueError("Unauthorized access")

    # 2. STUDENT → must restrict to own data
    if role == "student" and user_id:
        if f"s.student_id = '{user_id.lower()}'" in lower or f"s.student_id = '{user_id}'" in lower:
            return sql   # LLM already scoped it correctly
        if "where" in lower:
            return sql + f" AND s.student_id = '{user_id}'"
        return sql + f" WHERE s.student_id = '{user_id}'"

    # 3. FACULTY → must restrict to own department.
    #    Previously this was "return sql" with no enforcement at all —
    #    department scoping relied entirely on the LLM following the
    #    prompt instructions, with nothing checked on the backend.
    if role == "faculty" and department:
        if f"s.department = '{department.lower()}'" in lower or f"s.department = '{department}'" in lower:
            return sql   # LLM already scoped it correctly
        if "where" in lower:
            return sql + f" AND s.department = '{department}'"
        return sql + f" WHERE s.department = '{department}'"

    # 4. ADMIN → full access
    if role == "admin":
        return sql

    return sql