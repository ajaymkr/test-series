from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Score, Question, Option, User,ScoreAnswer
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
    # Check user
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Get all questions for this test
    questions = db.query(Question).filter(
        Question.test_id == data.test_id
    ).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    # Convert submitted answers into a dictionary
    submitted_answers = {
        answer.question_id: answer.option_id
        for answer in data.answers
    }

    correct_answers = 0
    total_score = 0

    try:
        # Validate and calculate score
        for question_id, option_id in submitted_answers.items():

            question = next(
                (q for q in questions if q.id == question_id),
                None
            )

            if not question:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid question"
                )

            if option_id is not None:
                option = db.query(Option).filter(
                    Option.id == option_id,
                    Option.question_id == question_id
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
        db.flush()

        # Save every question and its selected option
        for question in questions:

            selected_option_id = submitted_answers.get(
                question.id
            )

            score_answer = ScoreAnswer(
                score_id=new_score.id,
                question_id=question.id,
                selected_option_id=selected_option_id
            )

            db.add(score_answer)

        db.commit()
        db.refresh(new_score)

        return {
            "message": "Test submitted successfully",
            "score_id": new_score.id,
            "user_id": new_score.user_id,
            "test_id": new_score.test_id,
            "score": new_score.score,
            "total_questions": new_score.total_questions,
            "correct_answers": new_score.correct_answers
        }

    except Exception:
        db.rollback()
        raise


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


@router.get("/{score_id}/review")
def review_score(
    score_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    # Verify score belongs to this user
    score = db.query(Score).filter(
        Score.id == score_id,
        Score.user_id == user_id
    ).first()

    if not score:
        raise HTTPException(
            status_code=404,
            detail="Score not found"
        )

    # Get all questions in this test
    questions = db.query(Question).filter(
        Question.test_id == score.test_id
    ).all()

    # Get saved answers for this submission
    saved_answers = db.query(ScoreAnswer).filter(
        ScoreAnswer.score_id == score_id
    ).all()

    answers_by_question = {
        answer.question_id: answer
        for answer in saved_answers
    }

    review_data = []

    for question in questions:

        saved_answer = answers_by_question.get(question.id)

        selected_option_id = (
            saved_answer.selected_option_id
            if saved_answer else None
        )

        # Get all options
        options = db.query(Option).filter(
            Option.question_id == question.id
        ).all()

        # Find correct option
        correct_option = next(
            (option for option in options if option.is_correct),
            None
        )

        # Determine answer status
        if selected_option_id is None:
            status = "unattempted"

        elif correct_option and selected_option_id == correct_option.id:
            status = "correct"

        else:
            status = "incorrect"

        review_data.append({
            "question_id": question.id,
            "question_text": question.question_text,
            "marks": question.marks,
            "selected_option_id": selected_option_id,
            "correct_option_id": (
                correct_option.id if correct_option else None
            ),
            "status": status,
            "options": [
                {
                    "id": option.id,
                    "option_text": option.option_text,
                    "is_correct": option.is_correct
                }
                for option in options
            ]
        })

    return {
        "score_id": score.id,
        "test_id": score.test_id,
        "score": score.score,
        "total_questions": score.total_questions,
        "correct_answers": score.correct_answers,
        "questions": review_data
    }
