# app/services/summarizer.py
import json
from openai import AsyncOpenAI
from sqlalchemy import select
from app.config import get_settings
from app.db import async_session
from app.models.node import Node

settings = get_settings()
client = AsyncOpenAI(
    api_key=settings.groq_api_key,
    base_url="https://api.groq.com/openai/v1"
    )

SYSTEM_PROMPT = """You are a research assistant. Given webpage content, produce:
(1) A 2-4 sentence summary.
(2) 5 key concepts.
(3) 5-8 keywords.
Respond ONLY as JSON: {"summary": "...", "key_concepts": [...], "keywords": [...]}"""


async def run_summarization(node_id: str):
    async with async_session() as db:
        try:
            # Fetch the node
            result = await db.execute(select(Node).where(Node.id == node_id))
            node = result.scalar_one_or_none()
            if not node or not node.raw_text:
                return

            # Ask GPT-4o-mini to summarize
            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": node.raw_text[:4000]},
                ],
                temperature=0.3,
            )

            # Parse the JSON response
            data = json.loads(response.choices[0].message.content)
            node.summary = data["summary"]
            node.keywords = data["keywords"]
            node.key_concepts = data.get("key_concepts")
            node.summary_status = "complete"

        except (json.JSONDecodeError, KeyError):
            node.summary_status = "failed"

        except Exception:
            node.summary_status = "failed"

        await db.commit()
    
'''
What happens: 
This runs after the API already responded to the extension. 
It grabs the node's text → asks GPT-4o-mini to summarize it → parses the JSON response → updates the node with the summary and keywords. 
If anything fails, it marks the status as "failed" so you can retry later.
Why it creates its own session: Background tasks run outside the original request, so the original database session is already closed. 
It needs its own fresh session
'''