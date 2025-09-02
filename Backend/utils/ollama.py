# backend/utils/ollama.py
import httpx
import os
import json

# Use the environment variable for the Flask service endpoint.
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:5000/api/generate")

async def generate(prompt: str) -> str:
    payload = {
        "model": "mistral:7b",  # Set the model to your mistral:7b
        "prompt": prompt,
        "format": "json",  # If needed by your Flask endpoint.
        "options": {
            "temperature": 0.7,
            "max_tokens": 1000
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        data = response.json()
    # Assume the generated text is under the key "message" in the returned JSON.
    # Adjust this as needed based on your Flask server's output.
    return data.get("message", "")
