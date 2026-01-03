def build_prompt(question: str, schema: str) -> str:
    prompt = f"""
You are an expert PostgreSQL assistant for a university database.

DATABASE SCHEMA:
{schema}

STRICT RULES (VERY IMPORTANT):
- Generate ONLY a SQL SELECT query
- Use ONLY academic tables:
  - students
  - student_performance
  - faculty_details
- NEVER use authentication tables (users_auth)
- NEVER use linked_student_id
- student_performance.student_id is the ONLY student identifier
- Use ONLY columns exactly as defined in the schema
- Do NOT invent columns
- Do NOT explain anything
- Return ONLY the SQL query

USER QUESTION:
{question}

SQL QUERY:
"""
    return prompt.strip()
