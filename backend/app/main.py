from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, graph, nodes, query
from fastapi.routing import APIRouter
from app.config import get_settings
from app.db import engine,Base
from contextlib import asynccontextmanager
from sqlalchemy import text



settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform any startup tasks here
    print("Starting up the application...")
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Perform any shutdown tasks here
    print("Shutting down the application...")
    await engine.dispose()  # ✅ important
    

app = FastAPI(
    title="DeepTrail",
    description="An AI-powered tool which organizes your browser searches and interactions into a structured format, allowing you to easily review and manage your online activities.",
    version="0.1.0",
    lifespan=lifespan
    )


if settings.allow_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True if settings.cors_origins != ["*"] else False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(graph.router, prefix="/api/graph", tags=["Graph"])
app.include_router(nodes.router, prefix="/api/nodes", tags=["Node"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "DeepTrail"}