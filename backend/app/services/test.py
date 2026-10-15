from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Test


def get_tests(db: Session):

    tests = db.query(Test).all()

    return tests

def get_tests_id(test_id: int, db: Session):

    test = db.query(Test).filter(Test.id == test_id).first()

    return test

def get_tests_by_category(category: str, db: Session):
    tests = db.query(Test).filter(Test.category == category).all()

    return tests