from sqlalchemy import text
from db import engine

def authenticate_user(username: str, password: str):
    query = text("""
        SELECT role, linked_student_id
        FROM users_auth
        WHERE username = :username
        AND password = :password
    """)

    with engine.connect() as conn:
        result = conn.execute(
            query,
            {"username": username, "password": password}
        ).fetchone()

    if not result:
        return None

    return {
        "role": result[0],
        "linked_student_id": result[1]
    }
