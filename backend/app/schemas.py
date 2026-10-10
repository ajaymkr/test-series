from pydantic import BaseModel

class TestCreate(BaseModel):
    title: str
    description: str
    duration_minutes: int
    is_active: bool = True

class AttemptCreate(BaseModel):
    user_id: int
    test_id: int


class AttemptResponse(BaseModel):
    id: int
    user_id: int
    test_id: int
    score: int


class AnswerSubmit(BaseModel):
    question_id: int
    option_id: int


class SubmitAttemptRequest(BaseModel):
    answers: list[AnswerSubmit]


class SubmitAttemptResponse(BaseModel):
    attempt_id: int
    score: int
    total_questions: int
    message: str