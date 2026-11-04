from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User
from schemas.user import UserCreate


def get_users(db):
    users = db.query(User).all()

    return users

def create_users(user , db):
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=user.password_hash,
        role=user.role,
        created_at=user.created_at
    )
    

        

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

