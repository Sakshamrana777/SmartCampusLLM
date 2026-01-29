from rag_store import collection

def retrieve_faq_context(query: str, top_k=2):
    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    return results["documents"][0] if results["documents"] else []
