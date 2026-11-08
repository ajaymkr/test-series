from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Score
from schemas.user import UserCreate


def get_sores(db):
    users = db.query(Score).all()

    return users

def get_score(test_id, db):
    scores = db.query(Score).filter(Score.id == test_id).first()

    return scores

def create_scores(score , db):
    new_score = Score(
        user_id=score.user_id,
        test_id=score.test_id,
        score=score.score,
        total_questions=score.total_questions,
        correct_answers=score.correct_answers,
        submitted_at=score.submitted_at
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return new_score