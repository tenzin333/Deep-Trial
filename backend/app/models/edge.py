# app/models/edge.py
from sqlalchemy import Column, Float, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.db import Base


class Edge(Base):
    __tablename__ = "edges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_node_id = Column(UUID(as_uuid=True), ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False)
    target_node_id = Column(UUID(as_uuid=True), ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    source_node = relationship("Node", foreign_keys=[source_node_id], back_populates="edges_out")
    target_node = relationship("Node", foreign_keys=[target_node_id], back_populates="edges_in")

    # Prevent duplicate edges between same two nodes
    __table_args__ = (
        UniqueConstraint("source_node_id", "target_node_id", name="unique_edge"),
    )