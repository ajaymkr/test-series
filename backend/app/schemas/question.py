from pydantic import BaseModel
from datetime import datetime

class QuestionCreate(BaseModel):
    name: str
    test_id: int
    question_text: str
    marks: int
    

