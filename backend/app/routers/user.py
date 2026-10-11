from fastapi import APIRouter,Depends
from services.user import get_users
from sqlalchemy.orm import Session
from database.connection import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)
print("Users router loaded")
@router.get("/")
def read_users(db: Session = Depends(get_db)):
    a = get_users(db)
    return a



