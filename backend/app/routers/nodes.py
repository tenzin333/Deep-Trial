# app/routers/nodes.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete
from app.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.node import Node
from app.models.edge import Edge
from app.schemas.schemas import NodeCreate, NodeResponse, NodeIngestResponse
from app.services.extractor import extract_text
from app.services.embedder import get_embedding
from app.services.similarity import find_similar_nodes
from app.services.summarize import run_summarization

router = APIRouter()


@router.post("", response_model=NodeIngestResponse, status_code=201)
async def ingest_node(
    body: NodeCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        existing = await db.execute(
            select(Node).where(and_(Node.url == body.url, Node.user_id == user.id))
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="URL already ingested")

        node = Node(url=body.url, title=body.title, user_id=user.id)
        db.add(node)
        await db.flush()

        edges_created = 0

        text = await extract_text(body.url)
        if text:
            node.raw_text = text
            embedding = await get_embedding(text)
            node.embedding = embedding

            similar = await find_similar_nodes(db, embedding, str(user.id), str(node.id))
            for target_id, score in similar:
                edge = Edge(source_node_id=node.id, target_node_id=target_id, similarity_score=score)
                db.add(edge)
                edges_created += 1

            background_tasks.add_task(run_summarization, str(node.id))
        else:
            node.summary_status = "failed"
            
        return NodeIngestResponse(
            node_id=node.id,
            edges_created=edges_created,
            status="processing" if text else "failed",
        )

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to ingest page: {str(e)}")


@router.get("/{node_id}", response_model=NodeResponse)
async def get_node(
    node_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Node).where(and_(Node.id == node_id, Node.user_id == user.id))
    )
    node = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


@router.delete("/clearAll", status_code=204)
async def clear_all(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        user_node_ids = select(Node.id).where(Node.user_id == user.id)

        # Check if user has any nodes
        result = await db.execute(
            select(Node.id).where(Node.user_id == user.id).limit(1)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="No pages to clear")

        await db.execute(
            delete(Edge).where(
                (Edge.source_node_id.in_(user_node_ids)) |
                (Edge.target_node_id.in_(user_node_ids))
            )
        )

        await db.execute(
            delete(Node).where(Node.user_id == user.id)
        )

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear pages: {str(e)}")
    

@router.delete("/{node_id}", status_code=204)
async def delete_node(
    node_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    
    result = await db.execute(
        select(Node).where(and_(Node.id == node_id, Node.user_id == user.id))
    )
    node = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    await db.delete(node)



'''
The ingest flow in plain English: Extension sends a URL → we check it's not a duplicate → create a node record → fetch the page text → convert text to a 1536-number vector → scan existing nodes for similarity → create edges for matches → kick off summarization in the background → return immediately.
TODO: update the node if url already exits
'''