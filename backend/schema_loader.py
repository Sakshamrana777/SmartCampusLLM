from sqlalchemy import inspect
from db import engine

def load_schema():
    inspector = inspect(engine)

    allowed_tables = [
        "students",
        "student_performance",
        "faculty_details",
        "faqs"
    ]

    schema_description = ""

    for table_name in allowed_tables:
        if table_name not in inspector.get_table_names():
            continue

        schema_description += f"\nTABLE {table_name}:\n"

        columns = inspector.get_columns(table_name)
        for col in columns:
            schema_description += f"  - {col['name']}\n"

    return schema_description.strip()
