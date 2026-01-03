from sqlalchemy import inspect
from db import engine

def load_schema():
    inspector = inspect(engine)
    schema_description = ""

    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        column_names = [col["name"] for col in columns]

        schema_description += f"{table_name}({', '.join(column_names)})\n"

    return schema_description
