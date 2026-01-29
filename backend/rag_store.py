from chromadb import Client
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

# ----------------------------------------------------
# LAZY CLIENT (load only when needed)
# ----------------------------------------------------
_client = None
_collection = None

def get_collection():
    global _client, _collection
    if _client is None:
        _client = Client(Settings(anonymized_telemetry=False))

    if _collection is None:
        _collection = _client.get_or_create_collection("faqs")

    return _collection


# ----------------------------------------------------
# LIGHTWEIGHT EMBEDDING MODEL (15MB only)
# ----------------------------------------------------
_embedder = None

def get_embedder():
    global _embedder
    if _embedder is None:
        # ultra-light model safe for Render 512MB RAM
        _embedder = SentenceTransformer("paraphrase-MiniLM-L3-v2")
    return _embedder


# ----------------------------------------------------
# ADD FAQS — external API remains same
# ----------------------------------------------------
def add_faqs(faq_rows):
    """
    faq_rows = [(question, answer), ...]
    """
    collection = get_collection()
    embedder = get_embedder()

    for idx, (q, a) in enumerate(faq_rows):
        embedding = embedder.encode(q).tolist()
        collection.add(
            ids=[str(idx)],
            documents=[a],
            metadatas=[{"question": q}],
            embeddings=[embedding]
        )
