from fastapi import APIRouter,Depends
from services.test import get_tests,get_tests_id,get_tests_by_category, post_test
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.test import TestCreate

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)
print("Tests router loaded")
@router.get("/")
def read_tests(db: Session = Depends(get_db)):
    a = get_tests(db)
    return a

@router.get("/{test_id}")
def read_test_id(test_id: int, db: Session = Depends(get_db)):
    a = get_tests_id(test_id, db)
    
    return a

@router.get("/category/")
def read_tests_by_category(category_id: int, db: Session = Depends(get_db)):
    print("Ajay Kumar")
    a = get_tests_by_category(category_id, db)
    
    return a

@router.post("/")
def create_test(test: TestCreate , db: Session = Depends(get_db)):
    a = post_test(test,db)
    return a



