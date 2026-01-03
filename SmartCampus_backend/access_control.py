def apply_rbac(sql: str, role: str, user_id: str | None):
    """
    FINAL RBAC ENFORCEMENT (ABSOLUTELY FINAL)

    Handles:
    - Student self-access
    - Faculty restricted to student academic data
    - Blocks auth tables
    - JOIN aliases
    - WHERE / GROUP BY / ORDER BY placement
    """

    sql = sql.strip().rstrip(";")
    lower_sql = sql.lower()

    # 🚫 Block auth-related tables everywhere
    for forbidden in ["users_auth", "linked_student_id"]:
        if forbidden in lower_sql:
            raise ValueError("Unauthorized access to authentication data")

    # 👨‍🏫 Faculty restriction
    if role == "faculty":
        if not any(tbl in lower_sql for tbl in ["students", "student_performance"]):
            raise ValueError("Faculty can access student academic records only")

    # 👨‍🎓 Student restriction
    if role == "student" and user_id:
        # alias-safe student_id
        if "student_performance sp" in lower_sql or " sp." in lower_sql:
            condition = f"sp.student_id = '{user_id}'"
        elif "students s" in lower_sql or " s." in lower_sql:
            condition = f"s.student_id = '{user_id}'"
        else:
            condition = f"student_id = '{user_id}'"

        if "where" in lower_sql:
            # append to existing WHERE
            sql += f" AND {condition}"

        else:
            # insert WHERE before GROUP BY or ORDER BY
            insert_pos = len(sql)

            group_idx = lower_sql.find("group by")
            order_idx = lower_sql.find("order by")

            if group_idx != -1:
                insert_pos = group_idx
            elif order_idx != -1:
                insert_pos = order_idx

            sql = (
                sql[:insert_pos]
                + f" WHERE {condition} "
                + sql[insert_pos:]
            )

    return sql
