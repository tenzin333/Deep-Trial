# app/services/embedder.py
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from app.config import get_settings
from google import genai

settings = get_settings()

client = genai.Client(api_key=settings.gemini_api_key)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
async def get_embedding(text: str) -> list[float]:
    # Use 'contents' (plural) and ensure the config is passed correctly
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text, # Note: documentation uses 'contents'
        config={
            "output_dimensionality": 768
        }
    )
    # The SDK returns a list of embedding objects; we grab the first one
    return result.embeddings[0].values

'''
Converts text into a 1536-number vector.

What happens:
Send text to OpenAI → get back 1536 numbers that represent the meaning of that text. The @retry decorator means if OpenAI is slow or rate-limits you, 
it tries again up to 3 times with increasing wait times.
If you pass the word "Apple" into this function, it returns something like:
[0.0023, -0.0145, 0.0921, ... 1,500 more numbers]

'''