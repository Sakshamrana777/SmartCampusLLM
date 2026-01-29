from sqlalchemy import text
from db import engine

def execute_sql(sql, params=None):
    """
    Universal SQL executor for SmartCampus.
    Supports:
    - Raw SQL strings
    - SQLAlchemy text() objects
    - Optional parameters (needed for Supabase)
    """

    with engine.connect() as conn:

        # If SQL is plain string, convert to text()
        if isinstance(sql, str):
            stmt = text(sql)
        else:
            stmt = sql

        # Parameterized execution (Supabase requires this)
        if params:
            result = conn.execute(stmt, params)
        else:
            result = conn.execute(stmt)

        rows = result.fetchall()
        columns = result.keys()

        return rows, columns
