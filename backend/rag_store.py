from chromadb import Client
from chromadb.config import Settings

client = Client(Settings(anonymized_telemetry=False))
collection = client.get_or_create_collection("faqs")


def add_faqs(faq_rows):
    """
    Store FAQs without embeddings.
    Chroma will use basic keyword matching.
    """
    for idx, (q, a) in enumerate(faq_rows):
        collection.add(
            ids=[str(idx)],
            documents=[a],
            metadatas=[{"question": q}],
        )
