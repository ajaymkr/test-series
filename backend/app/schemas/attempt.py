from pydantic import BaseModel
from datetime import datetime

class AttemptCreate(BaseModel):
    user_id: int
    test_id: int
    score: int
    started_at: datetime
    submitted_at: datetime
    

