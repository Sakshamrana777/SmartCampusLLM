def is_safe_sql(sql: str) -> bool:
    forbidden_keywords = [
        "INSERT", "UPDATE", "DELETE",
        "DROP", "ALTER", "TRUNCATE",
        "CREATE"
    ]

    sql_upper = sql.upper()

    for keyword in forbidden_keywords:
        if keyword in sql_upper:
            return False

    return True
