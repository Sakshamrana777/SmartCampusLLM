import os
import requests

def call_llm(prompt: str) -> str:
    api_key = "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"
    model = "meta-llama/llama-3.1-8b-instruct"

    if not api_key:
        raise Exception("OPENROUTER_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Referer": "http://localhost",
        "X-Title": "SmartCampus"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",    
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        raise Exception(response.text)

    return response.json()["choices"][0]["message"]["content"]
