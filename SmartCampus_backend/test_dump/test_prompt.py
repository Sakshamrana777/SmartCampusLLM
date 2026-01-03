from prompt_builder import build_prompt

fake_schema = """student_info(student_id, name, department)
student_performance(student_id, subject_name, gpa)
"""

question = "Show average GPA by department"

prompt = build_prompt(question, fake_schema)

print(prompt)
