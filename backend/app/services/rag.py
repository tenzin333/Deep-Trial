
# app/services/rag.py
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from openai import AsyncOpenAI
from app.config import get_settings
from app.schemas.schemas import QueryResponse, SourceNode
from app.services.embedder import get_embedding

settings = get_settings()
client = AsyncOpenAI(api_key=settings.groq_api_key, base_url="https://api.groq.com/openai/v1")


async def answer_question(db: AsyncSession, question: str, user_id: str) -> QueryResponse:
    # Step 1: Convert question to embedding
    query_embedding = await get_embedding(question)

    # Step 2: Find top 5 most relevant nodes
    result = await db.execute(
        text("""
            SELECT id, url, title, summary, 1 - (embedding <=> :vec) AS score
            FROM nodes
            WHERE user_id = :uid
              AND embedding IS NOT NULL
              AND summary IS NOT NULL
            ORDER BY embedding <=> :vec
            LIMIT 5
        """),
        {"vec": str(query_embedding), "uid": user_id},
    )
    rows = result.fetchall()

    # If no relevant nodes found
    if not rows:
        return QueryResponse(answer="I don't have enough browsing data to answer that yet.", sources=[])

    # Step 3: Build context from summaries
    context = "\n\n".join(
        f"Source: {row.title} ({row.url})\nSummary: {row.summary}"
        for row in rows
    )

    # Step 4: Ask GPT-4o-mini to answer using the context
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a research assistant. Answer the user's question based ONLY on the provided sources. If the sources don't contain enough info, say so. Cite which sources you used.",
            },
            {
                "role": "user",
                "content": f"Sources:\n{context}\n\nQuestion: {question}",
            },
        ],
        temperature=0.3,
    )

    # Step 5: Return answer with source citations
    return QueryResponse(
        answer=response.choices[0].message.content,
        sources=[
            SourceNode(url=row.url, title=row.title, similarity_score=round(row.score, 3))
            for row in rows
        ],
    )

'''
The star of the show — answers natural language questions using your browsing history.
The RAG flow in plain English: 
User asks "What was I reading about transformers?" → convert that question to an embedding → find the 5 pages from their history that are closest in meaning → combine those summaries into a context block → ask GPT-4o-mini to answer the question using only those sources → return the answer with links to the original pages.\
    
What makes this different from "Normal" GPT?
If you just asked GPT-4o-mini "What did I browse yesterday about AI?", it would say, "I don't know, I'm an AI." This code changes that:

Retrieval: It goes to your nodes table.

Context: It grabs your summaries of yesterday's browsing.

Knowledge Injection: It tells GPT, "Hey, look at these 5 summaries. Now answer the question.
By providing private context (your browsing data) to a public model (GPT), you've created a Retrieval Augmented system.
'''