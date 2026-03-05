# app/models/node.py
from sqlalchemy import Column, Text, String, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
import uuid
from datetime import datetime, timezone
from app.db import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = Column(Text, nullable=False)
    title = Column(Text)
    raw_text = Column(Text)
    summary = Column(Text)
    keywords = Column(ARRAY(Text))
    key_concepts = Column(JSONB)
    embedding = Column(Vector(768))
    summary_status = Column(String(20), default="pending")
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="nodes")

    # Edges where this node is the source
    edges_out = relationship("Edge", foreign_keys="Edge.source_node_id", back_populates="source_node", cascade="all, delete-orphan")

    # Edges where this node is the target
    edges_in = relationship("Edge", foreign_keys="Edge.target_node_id", back_populates="target_node", cascade="all, delete-orphan")