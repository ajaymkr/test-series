from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User
from schemas.user import UserCreate
from pwdlib import PasswordHash


def get_users(db):
    users = db.query(User).all()

    return users

def get_user(user_id, db):
    users = db.query(User).filter(User.id == user_id).first()

    return users

def create_users(user, db):
    password_hash = PasswordHash.recommended()

    hashed_password = password_hash.hash(user.password_hash)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        created_at=user.created_at
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

