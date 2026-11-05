from fastapi import APIRouter,Depends,HTTPException
from services.category import read_category, create_category, list_category,read_category_by_user_id
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.category import CategoryCreate
from sqlalchemy.orm import Session

from database.models import Category


router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

@router.post("/")
def post_category(category : CategoryCreate, db: Session = Depends(get_db)):
    a =create_category(category,db)
    return a 
    

@router.get("/", response_model= list[CategoryCreate])
def all_category(user_id: int,db: Session = Depends(get_db)):
    a =list_category(user_id,db)
    return a 

@router.get("/category")
def get_category(category_id: int,db: Session = Depends(get_db)):
    a =read_category(category_id,db)
    return a 
@router.get("/user_id")
def get_category_by_user_id(user_id: int,db: Session = Depends(get_db)):
    a =read_category_by_user_id(user_id,db)
    return a 




