from dotenv import load_dotenv
load_dotenv()

import os

print("KEY =", os.getenv("OPENROUTER_API_KEY"))
print("MODEL =", os.getenv("OPENROUTER_MODEL"))
print("DB =", os.getenv("DATABASE_URL"))
