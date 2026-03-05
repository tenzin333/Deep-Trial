# app/routers/graph.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.node import Node
from app.models.edge import Edge
from app.schemas.schemas import GraphResponse, NodeResponse, EdgeResponse

router = APIRouter()


@router.get("", response_model=GraphResponse)
async def get_graph(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Get all nodes for this user
    node_result = await db.execute(
        select(Node).where(Node.user_id == user.id).order_by(Node.created_at.desc())
    )
    
    nodes = node_result.scalars().all()
    node_ids = [node.id for node in nodes]

    # Get all edges between this user's nodes
    edge_result = await db.execute(
        select(Edge).where(Edge.source_node_id.in_(node_ids))
    )
    
    edges = edge_result.scalars().all()

    return GraphResponse(
        nodes=[NodeResponse.model_validate(n) for n in nodes],
        edges=[
            EdgeResponse(
                source=e.source_node_id,
                target=e.target_node_id,
                similarity=e.similarity_score,
            )
            for e in edges
        ],
    )
    
'''
Frontend calls this every 30 seconds. 
It returns all the user's nodes and edges in one shot. 
The Side Panel uses this to render the knowledge graph.
'''