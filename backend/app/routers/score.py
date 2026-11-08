from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Score, Question, Option, User
from schemas.score import ScoreCreate
from sqlalchemy import func

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

@router.get("/user/{user_id}/latest")
def get_latest_scores(user_id: int, db: Session = Depends(get_db)):

    # Check whether user exists
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Assign a row number to each score for each test.
    # Latest attempt gets row number 1.
    ranked_scores = (
        db.query(
            Score.id,
            Score.user_id,
            Score.test_id,
            Score.score,
            Score.total_questions,
            Score.correct_answers,
            Score.submitted_at,
            func.row_number().over(
                partition_by=Score.test_id,
                order_by=(
                    Score.submitted_at.desc(),
                    Score.id.desc()
                )
            ).label("row_num")
        )
        .filter(Score.user_id == user_id)
        .subquery()
    )

    # Return only the latest 3 attempts for each test
    results = (
        db.query(ranked_scores)
        .filter(ranked_scores.c.row_num <= 3)
        .order_by(
            ranked_scores.c.test_id,
            ranked_scores.c.submitted_at.desc()
        )
        .all()
    )

    return [
        {
            "id": row.id,
            "user_id": row.user_id,
            "test_id": row.test_id,
            "score": row.score,
            "total_questions": row.total_questions,
            "correct_answers": row.correct_answers,
            "submitted_at": row.submitted_at
        }
        for row in results
    ]
