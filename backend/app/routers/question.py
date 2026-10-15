from fastapi import APIRouter,Depends
from services.question import get_questions
from sqlalchemy.orm import Session
from database.connection import get_db

router = APIRouter(
    prefix="/questions",
    tags=["questions"]
)
print("Questions router loaded")
@router.get("/")
def read_questions(db: Session = Depends(get_db)):
    a = get_questions(db)
    return a

# @router.get("/{test_id}")
# def read_test_id(test_id: int, db: Session = Depends(get_db)):
#     a = get_tests_id(test_id, db)
    
#     return a

# @router.get("/category/{category}")
# def read_tests_by_category(category: str, db: Session = Depends(get_db)):
#     a = get_tests_by_category(category, db)
#     return a



