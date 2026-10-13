from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User


def get_users(db: Session):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "eligible_tests": user.eligible_tests
        }
        for user in users
    ]