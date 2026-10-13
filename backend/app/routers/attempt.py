from fastapi import APIRouter,Depends
from services.attempt import get_attempts
from sqlalchemy.orm import Session
from database.connection import get_db

router = APIRouter(
    prefix="/attempts",
    tags=["attempts"]
)
print("Attempts router loaded")
@router.get("/")
def read_attempts(db: Session = Depends(get_db)):
    a = get_attempts(db)
    return a



