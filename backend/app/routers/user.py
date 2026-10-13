
from modulefinder import test

from database.models import User
# from routers import test
from database.models import User
from fastapi import APIRouter,Depends,HTTPException
from services.user import get_users
from sqlalchemy.orm import Session
from database.connection import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)
print("Users router loaded")
@router.get("/")
def read_users(db: Session = Depends(get_db)):
    a = get_users(db)
    return a

@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from schemas.auth import LoginRequest, LoginResponse, UserResponse
from services.auth_service import authenticate_user, create_access_token

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/", response_model= list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/login", response_model=LoginResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, data.email, data.password)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }




