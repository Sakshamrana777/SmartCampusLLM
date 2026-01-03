from db import engine
from sqlalchemy import text
from rag_store import add_faqs
from rag_retriever import retrieve_faq_context

# 1. Load FAQs from DB
with engine.connect() as conn:
    rows = conn.execute(
        text("SELECT question, answer FROM faqs")
    ).fetchall()

faq_rows = [(r[0], r[1]) for r in rows]
add_faqs(faq_rows)

# 2. Ask a policy question
query = "What is the attendance rule?"
context = retrieve_faq_context(query)

print("RETRIEVED CONTEXT:")
for c in context:
    print("-", c)
