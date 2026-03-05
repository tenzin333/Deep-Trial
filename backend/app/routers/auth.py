from fastapi import FastAPI
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import UserLogin, UserRegister, TokenResponse
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.config import get_settings
from datetime import datetime, timedelta, timezone
from jose import jwt
import bcrypt 


settings = get_settings()
router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

async def create_token(userId: str):
    
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expiry_hours)
    return jwt.encode({"sub": userId, "exp": expire}, settings.jwt_secret, algorithm="HS256")


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin, db: AsyncSession= Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    
    user = existing.scalar_one_or_none()
     
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email and password")
    
    return TokenResponse(access_token=await create_token(str(user.id)))
  

@router.post("/register", response_model= TokenResponse)
async def register(body: UserRegister, db: AsyncSession = Depends(get_db)):
    try:
        # Create user object
        user = User(
            email=body.email, 
            password_hash=hash_password(body.password)
        )
        
        db.add(user)
        return TokenResponse(access_token=await create_token(str(user.id)))

    except IntegrityError as e:
        await db.rollback()  # Crucial: always rollback on error
        
        # 'e.orig' contains the specific database driver error
        # For Postgres, this usually contains "Key (email)=(...) already exists"
        error_detail = str(e.orig).split("DETAIL:  ")[-1].strip() if "DETAIL" in str(e.orig) else "Database integrity violation"
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {error_detail}"
        )
