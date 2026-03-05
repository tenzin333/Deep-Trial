# Finds nodes with similar meaning and creates edges.
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_settings


settings = get_settings()

async def find_similar_nodes(
    db: AsyncSession,
    embedding: list[float],
    user_id: str,
    exclude_id: str,
) -> list[tuple[str, float]]:
    query = text("""
        SELECT id, 1 - (embedding <=> :vec) AS score
        FROM nodes
        WHERE user_id = :uid
          AND id != :eid
          AND embedding IS NOT NULL
        ORDER BY embedding <=> :vec
        LIMIT 10
    """)

    result = await db.execute(query, {
        "vec": str(embedding),
        "uid": user_id,
        "eid": exclude_id,
    })

    return [
        (str(row.id), row.score)
        for row in result
        if row.score >= settings.similarity_threshold
    ]

'''
What happens: 
Takes the new page's embedding → asks PostgreSQL "which of this user's existing pages have the most similar meaning?" → pgvector does cosine similarity math → returns only matches above 0.75 (your threshold). 
Each match becomes an edge in the graph.

Instead of searching for matching words (like WHERE text LIKE '%apple%'), it is searching for matching meanings using geometry.

The Math: <=> and 1 - (...)
This is the most important part of the query.
embedding <=> :vec: The <=> operator calculates the Cosine Distance between two vectors.
If two items are identical, the distance is 0.
If they are completely different, the distance is 1 (or more).
1 - (distance) AS score: We usually prefer a "Similarity Score" where a higher number is better.
    If distance is 0, the score is 1.0 (Perfect Match).
    If distance is 0.2, the score is 0.8 (Very Similar).
'''