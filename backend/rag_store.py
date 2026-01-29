from chromadb import Client
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

# In-memory Chroma (enough for demo)
client = Client(Settings(anonymized_telemetry=False))
collection = client.get_or_create_collection("faqs")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def add_faqs(faq_rows):
    """
    faq_rows = [(question, answer), ...]
    """
    for idx, (q, a) in enumerate(faq_rows):
        embedding = embedder.encode(q).tolist()
        collection.add(
            ids=[str(idx)],
            documents=[a],
            metadatas=[{"question": q}],
            embeddings=[embedding]
        )
