# from pydantic import BaseModel
# from datetime import datetime

# class ScoreCreate(BaseModel):
#     user_id: int
#     test_id: int
#     score: int
#     total_questions: int
#     correct_answers: int
#     submitted_at: datetime

# class ScoreGet(BaseModel):
#     user_id: int
#     test_id: int
#     score: int
#     total_questions: int
#     correct_answers: int
#     submitted_at: datetime


from pydantic import BaseModel
from typing import List, Optional


class AnswerItem(BaseModel):
    question_id: int
    option_id: Optional[int] = None


class ScoreCreate(BaseModel):
    user_id: int
    test_id: int
    answers: List[AnswerItem]