def authenticate_user(username, password):
    from db import engine
    from sqlalchemy import text

    with engine.connect() as conn:
        row = conn.execute(
            text("""
                SELECT user_id, username, password, role, linked_student_id, department
                FROM users_auth
                WHERE username = :u AND password = :p
            """),
            {"u": username, "p": password}
        ).fetchone()

    if not row:
        return None

    return {
        "user_id": row[0],
        "username": row[1],
        "password": row[2],
        "role": row[3],
        "linked_student_id": row[4],
        "department": row[5]  
    }
