import os
import requests

# Load from environment variables
API_KEY = os.getenv("OPENROUTER_API_KEY")   # stored in Render
MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct")

def call_llm(prompt: str) -> str:
    if not API_KEY:
        raise Exception("❌ OPENROUTER_API_KEY is missing! Set it in Render Environment Variables.")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Referer": "https://your-app-domain",  # optional
        "X-Title": "SmartCampus"
    }

    payload = {
        "model": MODEL,
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
