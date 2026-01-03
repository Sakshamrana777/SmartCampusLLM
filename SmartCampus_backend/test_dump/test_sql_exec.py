from query_executor import execute_sql

sql = "SELECT * FROM students LIMIT 3;"

rows, columns = execute_sql(sql)

print("COLUMNS:")
print(columns)

print("\nROWS:")
for row in rows:
    print(row)
