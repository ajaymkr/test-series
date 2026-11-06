from fastapi import APIRouter,Depends
from services.question import get_questions_by_test_id,post_question
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.question import QuestionCreate

router = APIRouter(
    prefix="/questions",
    tags=["questions"]
)
print("Questions router loaded")
@router.get("/")
def read_questions(test_id: int,db: Session = Depends(get_db)):
    questions = get_questions_by_test_id(test_id,db)
    return questions

@router.post("/")
def create_question(test : QuestionCreate, db: Session = Depends(get_db)):
    a =post_question(test,db)
    return a 

# @router.get("/{test_id}")
# def read_test_id(test_id: int, db: Session = Depends(get_db)):
#     a = get_tests_id(test_id, db)
    
#     return a

# @router.get("/category/{category}")
# def read_tests_by_category(category: str, db: Session = Depends(get_db)):
#     a = get_tests_by_category(category, db)
#     return a



