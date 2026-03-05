# app/routers/query.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.schemas import QueryRequest, QueryResponse
from app.services.rag import answer_question

router = APIRouter()


@router.post("", response_model=QueryResponse)
async def query_graph(
    body: QueryRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await answer_question(db, body.question, str(user.id))
    return result

'''
Takes the user's question, passes it to the RAG service 
(which we'll build next), returns the answer with source citations.
'''