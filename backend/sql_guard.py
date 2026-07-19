import re


def is_safe_sql(sql: str) -> bool:
    """
    Validates that the generated query is a single, read-only SELECT.

    Previous version only blocklisted a few keywords, which meant:
    - stacked queries ("...; DROP TABLE students") were never caught
    - SQL comments (-- or /* */) could be used to hide malicious tails
    - system catalog probing (information_schema, pg_*) was wide open
    - a query that was UPDATE/DELETE dressed up with a SELECT alias
      earlier in the string could sometimes slip through

    This version is allowlist-first (must literally start with SELECT)
    then applies a broader blocklist as defense in depth.
    """
    if not sql or not sql.strip():
        return False

    cleaned = sql.strip()

    # Reject stacked statements: a semicolon anywhere except a single
    # trailing one means there's more than one statement.
    if ";" in cleaned.rstrip(";"):
        return False

    # Allowlist: must be a SELECT statement. Nothing else is permitted,
    # regardless of what keywords appear later in the string.
    if not re.match(r"^\s*SELECT\s", cleaned, re.IGNORECASE):
        return False

    sql_upper = cleaned.upper()

    forbidden_keywords = [
        "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE", "CREATE",
        "GRANT", "REVOKE", "EXECUTE", "MERGE", "CALL",
        "INFORMATION_SCHEMA", "PG_", "PG_SLEEP", "PG_READ_FILE",
        "COPY ", "--", "/*", "*/", "XP_",
    ]

    for keyword in forbidden_keywords:
        if keyword in sql_upper:
            return False

    return True