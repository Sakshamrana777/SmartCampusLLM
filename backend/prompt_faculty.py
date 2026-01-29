def build_faculty_prompt(question: str, schema: str, department: str):
    return f"""
You generate ONLY PostgreSQL SELECT queries. STRICT.

FACULTY RULES:
- Faculty can ONLY access:
      students
      student_performance
- NEVER use any other table.
- ALWAYS USE THIS JOIN (no exceptions):
      FROM students s
      JOIN student_performance sp
      ON s.student_id = sp.student_id
- ALWAYS filter BY department:
      s.department = '{department}'
- NEVER invent column names.
- NEVER reference users_auth or linked_student_id.
- NEVER return explanations. SQL ONLY.

OUTPUT RULES:
If question is about GPA or marks:
    SELECT s.student_name, s.department, sp.subject_name, sp.final_marks, sp.gpa

If question is about attendance:
    SELECT s.student_name, s.department, sp.subject_name, sp.absences

If question is about performance in general:
    SELECT s.student_name, s.department, sp.subject_name, sp.final_marks, sp.gpa, sp.absences

If question is about department summary:
    SELECT
        s.department,
        COUNT(s.student_id) AS total_students,
        ROUND(AVG(sp.gpa),2) AS avg_gpa,
        SUM(sp.absences) AS total_absences
    FROM students s
    JOIN student_performance sp ON s.student_id = sp.student_id
    WHERE s.department = '{department}'
    GROUP BY s.department

SCHEMA:
{schema}

USER QUESTION:
{question}

SQL ONLY:
""".strip()
