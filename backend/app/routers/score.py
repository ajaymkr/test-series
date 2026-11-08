from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Score, Question, Option, User
from schemas.score import ScoreCreate

router = APIRouter(
    prefix="/scores",
    tags=["Scores"]
)


@router.post("/")
def submit_score(
    data: ScoreCreate,
    db: Session = Depends(get_db)
):

    # Get logged-in user's ID from frontend
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Get questions for this test
    questions = db.query(Question).filter(
        Question.test_id == data.test_id
    ).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    correct_answers = 0
    total_score = 0

    # Calculate score
    for answer in data.answers:

        question = db.query(Question).filter(
            Question.id == answer.question_id,
            Question.test_id == data.test_id
        ).first()

        if not question:
            raise HTTPException(
                status_code=400,
                detail="Invalid question"
            )

        option = db.query(Option).filter(
            Option.id == answer.option_id,
            Option.question_id == answer.question_id
        ).first()

        if not option:
            raise HTTPException(
                status_code=400,
                detail="Invalid option"
            )

        if option.is_correct:
            correct_answers += 1
            total_score += question.marks

    # Save score
    new_score = Score(
        user_id=data.user_id,
        test_id=data.test_id,
        score=total_score,
        total_questions=len(questions),
        correct_answers=correct_answers
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return {
        "message": "Test submitted successfully",
        "user_id": new_score.user_id,
        "test_id": new_score.test_id,
        "score": new_score.score,
        "total_questions": new_score.total_questions,
        "correct_answers": new_score.correct_answers
    }