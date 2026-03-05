# app/models/__init__.py
from app.models.user import User
from app.models.node import Node
from app.models.edge import Edge

'''
Here's how the three tables relate in simple terms:

User (one) ──→ (many) Node (one) ──→ (many) Edge
                                          ↑
                      Node (one) ──────────┘
- A User can have many Nodes (webpages they saved).
- Each Node can have many outgoing Edges (similarities to other Nodes).
- Each Edge connects one source Node to one target Node, representing how similar they are.
'''