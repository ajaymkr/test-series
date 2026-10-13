from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Test


def get_tests(db: Session):

    tests = db.query(Test).all()

    return tests