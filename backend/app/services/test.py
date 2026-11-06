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

def get_tests_by_category(category_id: int, db: Session):
   
    tests = db.query(Test).filter(Test.category_id == category_id).all()
   
    return tests

def post_test(test , db):
    new_test = Test(
        title=test.title,
        description=test.description,
        duration_minutes=test.duration_minutes,
        is_active=test.is_active,
        created_at=test.created_at,
        category_id=test.category_id
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    return new_test