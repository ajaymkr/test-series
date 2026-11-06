from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Option
from schemas.option import OptionCreate


def get_option_by_question_id(question_id,db):
    options = db.query(Option).filter(Option.question_id==question_id).all()

    return options

def post_option(option , db):
    new_option = Option(
        question_id=option.question_id,
        option_text=option.option_text,
        is_correct=option.is_correct,
    )
    db.add(new_option)
    db.commit()
    db.refresh(new_option)

    return new_option

