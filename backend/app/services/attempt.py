from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Attempt


def get_attempts(db: Session):

    attempts = db.query(Attempt).all()

    return attempts