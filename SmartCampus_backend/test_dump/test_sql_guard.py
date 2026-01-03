from sql_guard import is_safe_sql

print(is_safe_sql("SELECT * FROM student_info"))
print(is_safe_sql("DELETE FROM student_info"))
print(is_safe_sql("DROP TABLE student_info"))
print(is_safe_sql("UPDATE student_info SET name='X'"))
