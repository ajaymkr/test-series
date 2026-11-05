from fastapi import APIRouter,Depends
from services.attempt import get_attempts, post_attempt
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.attempt import AttemptCreate

router = APIRouter(
    prefix="/attempts",
    tags=["attempts"]
)
print("Attempts router loaded")
@router.get("/")
def read_attempts(db: Session = Depends(get_db)):
    a = get_attempts(db)
    return a

@router.post("/")
def read_attempts(attempt: AttemptCreate ,db: Session = Depends(get_db)):
    a = post_attempt(attempt,db)
    return a



