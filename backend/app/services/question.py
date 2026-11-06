from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Question


def get_questions_by_test_id(test_id,db: Session):

    questions = db.query(Question).filter(Question.test_id==test_id).all()

    return questions

def post_question(question , db):
    new_question = Question(
        test_id=question.test_id,
        question_text=question.question_text,
        marks=question.marks,
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question
    
