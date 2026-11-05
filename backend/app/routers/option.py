from fastapi import APIRouter,Depends
from services.option import get_option, post_option
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.option import OptionCreate

router = APIRouter(
    prefix="/options",
    tags=["options"]
)
print("Tests router loaded")
@router.get("/")
def read_option(db: Session = Depends(get_db)):
    a = get_option(db)
    return a

# @router.get("/{test_id}")
# def read_test_id(test_id: int, db: Session = Depends(get_db)):
#     a = get_tests_id(test_id, db)
    
#     return a

# @router.get("/category/{category}")
# def read_tests_by_category(category: str, db: Session = Depends(get_db)):
#     a = get_tests_by_category(category, db)
#     return a

@router.post("/")
def create_option(option: OptionCreate , db: Session = Depends(get_db)):
    a = post_option(option,db)
    return a



