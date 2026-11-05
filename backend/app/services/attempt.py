from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Attempt


def get_attempts(db: Session):

    attempts = db.query(Attempt).all()

    return attempts

def post_attempt(attempt , db):
    new_attempt = Attempt(
        user_id=attempt.user_id,
        test_id=attempt.test_id,
        score=attempt.score,
        started_at=attempt.started_at,
        submitted_at=attempt.submitted_at
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return new_attempt