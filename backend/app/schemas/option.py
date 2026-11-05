from pydantic import BaseModel
from datetime import datetime

class OptionCreate(BaseModel):
    question_id: int
    option_text: str
    is_correct: bool