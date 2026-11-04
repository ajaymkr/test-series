from fastapi import APIRouter,Depends,HTTPException
from services.category import get_category, create_category
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
def get_category(db: Session = Depends(get_db)):
    return db.query(Category).all()




