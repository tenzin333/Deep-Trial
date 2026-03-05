# app/models/user.py
from sqlalchemy import Column, Text, String
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))

    # A user has many nodes
    nodes = relationship("Node", back_populates="user", cascade="all, delete-orphan")