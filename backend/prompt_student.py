def build_student_prompt(question: str, schema: str, user_id: str):
    return f"""
You MUST generate ONLY a PostgreSQL SELECT query.
No explanation, no text, no markdown, no comments.

==============================
STUDENT ACCESS RULES (STRICT)
==============================
- Student can access ONLY their own data.
- ALWAYS use this join pattern:

    FROM students s
    JOIN student_performance sp
    ON s.student_id = sp.student_id

- ALWAYS filter student data using:
    s.student_id = '{user_id}'

- NEVER use any table except:
    students
    student_performance

- NEVER reference:
    users_auth
    linked_student_id
    faculty_details

==============================
COLUMN OUTPUT RULES
==============================
If question is about:
- GPA / marks / best / worst / top / lowest ->
    SELECT s.student_name, sp.subject_name, sp.final_marks, sp.gpa

- attendance / absences ->
    SELECT s.student_name, sp.subject_name, sp.absences

- general performance ->
    SELECT s.student_name, sp.subject_name, sp.final_marks, sp.gpa, sp.absences

==============================
ORDERING RULES (VERY IMPORTANT)
==============================
If the question mentions:
- "top", "best", "highest"  -> ORDER BY sp.gpa DESC, sp.final_marks DESC
- "worst", "lowest"         -> ORDER BY sp.gpa ASC, sp.final_marks ASC

==============================
SCHEMA:
{schema}
==============================

USER QUESTION:
{question}

Generate ONLY the SQL SELECT query:
""".strip()
