from fastapi import APIRouter,Depends
from services.test import get_tests
from sqlalchemy.orm import Session
from database.connection import get_db

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)
print("Tests router loaded")
@router.get("/")
def read_tests(db: Session = Depends(get_db)):
    a = get_tests(db)
    return a



