from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User


def get_users(db: Session):
    users = db.query(User).all()

    return users