from rag_store import get_collection, get_embedder

def retrieve_faq_context(query: str, top_k=2):
    collection = get_collection()
    embedder = get_embedder()

    query_embedding = embedder.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    docs = results.get("documents", [[]])

    return docs[0] if docs else []
