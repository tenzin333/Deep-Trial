# This file sets up the connection to the PostgreSQL database using SQLAlchemy's async features using ORM.
# It defines the engine, session maker, and a base class for our models.

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings

settings = get_settings()

# 1. Create the engine — this is the "connection" to your database
engine = create_async_engine(
    settings.database_url,
    pool_size=20,
    pool_pre_ping=True,
    pool_recycle=300,     
    echo=True,
    connect_args={
        "statement_cache_size": 0,  # ← disables statement caching
    }
)

# 2. Session maker — creates a fresh "conversation" with the DB for each request
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 3. Base class — all your models (User, Node, Edge) will inherit from this
class Base(DeclarativeBase):
    pass

# 4. Dependency — FastAPI uses this to give each route its own DB session
async def get_db():
    async with async_session() as session:
        try:
            yield session 
            await session.commit()
        except Exception:
            await session.rollback()
            raise
''''
**What each part does in plain English:**

**Engine** — Think of it as opening a phone line to your database. You do it once when the app starts. `pool_size=20` means up to 20 requests can talk to the DB at the same time.

**Session maker** — Each time someone hits your API, they get their own session — like their own private conversation with the database. When the request is done, the session closes.

**Base** — This is just a parent class. When you later create your `User`, `Node`, `Edge` models, they all say "I'm a database table" by inheriting from `Base`.

**get_db()** — This is a FastAPI "dependency". In your routes, you write `db: AsyncSession = Depends(get_db)` and FastAPI automatically gives you a database session, commits it if everything went well, or rolls back if something broke.
'''