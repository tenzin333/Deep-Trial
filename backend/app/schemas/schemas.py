from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


# ── Auth ─────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Nodes ────────────────────────────────────────────

class NodeCreate(BaseModel):
    url: str
    title: str
    timestamp: datetime

class NodeResponse(BaseModel):
    id: UUID
    url: str
    title: str
    summary: str | None = None
    keywords: list[str] | None = None
    summary_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class NodeIngestResponse(BaseModel):
    node_id: UUID
    edges_created: int
    status: str


# ── Edges ────────────────────────────────────────────

class EdgeResponse(BaseModel):
    source: UUID
    target: UUID
    similarity: float

    class Config:
        from_attributes = True


# ── Graph ────────────────────────────────────────────

class GraphResponse(BaseModel):
    nodes: list[NodeResponse]
    edges: list[EdgeResponse]


# ── RAG Query ────────────────────────────────────────

class QueryRequest(BaseModel):
    question: str

class SourceNode(BaseModel):
    url: str
    title: str
    similarity_score: float

class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceNode]

'''
The flow looks like this:

Extension sends NodeCreate → API validates it → creates a database row → returns NodeIngestResponse
Frontend calls graph → API returns GraphResponse with all nodes and edges
User asks a question via QueryRequest → RAG engine returns QueryResponse with answer + sources
'''