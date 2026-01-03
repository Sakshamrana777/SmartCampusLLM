from db import engine

with engine.connect() as conn:
    print("DB CONNECTED SUCCESSFULLY")
