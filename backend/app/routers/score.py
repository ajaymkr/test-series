from fastapi import APIRouter,Depends
from services.score import get_score, create_scores
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.score import ScoreCreate

router = APIRouter(
    prefix="/sores",
    tags=["scores"]
)
print("score router loaded")
# @router.get("/")
# def read_tests(db: Session = Depends(get_db)):
#     a = get_tests(db)
#     return a

@router.get("/")
def read_score_id(test_id: int, db: Session = Depends(get_db)):
    score = get_score(test_id, db)
    
    return score

# @router.get("/category/")
# def read_tests_by_category(category_id: int, db: Session = Depends(get_db)):
#     print("Ajay Kumar")
#     a = get_tests_by_category(category_id, db)
    
    return a

@router.post("/")
def create_score(score: ScoreCreate , db: Session = Depends(get_db)):
    score = create_scores(score,db)
    return score



