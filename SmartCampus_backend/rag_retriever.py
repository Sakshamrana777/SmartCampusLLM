from rag_store import collection, embedder

def retrieve_faq_context(query: str, top_k=2):
    query_embedding = embedder.encode(query).tolist()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results["documents"][0] if results["documents"] else []
